import { track, api } from "lwc";
import { isRepeatNotation } from "c/sfGpsDsOsrtOmniscriptInternalUtils";
import {
  createGlobalActionList,
  displayErrorModal,
  runAction
} from "c/sfGpsDsOsrtOmniscriptEditBlockUtils";
import pubsub from "c/sfGpsDsOsrtPubsub";
import { handleMultiLangLabel } from "c/sfGpsDsOsrtOmniscriptCustomLabels"; // will be removed and will use getCustomLabel, I think.
import OmniscriptGroupElement from "c/sfGpsDsOsrtOmniscriptGroupElement";

import tmpl_blank from "./omniscriptEditBlockBlank.html";
import tmpl_table from "./omniscriptEditBlock_slds.html";
import tmpl_table_nds from "./omniscriptEditBlock_nds.html";
import tmpl_inline from "./omniscriptEditBlockInline.html";
import tmpl_inline_nds from "./omniscriptEditBlockInline_nds.html";
import tmpl_card from "./omniscriptEditBlockCards.html";
import tmpl_card_nds from "./omniscriptEditBlockCards_nds.html";
import tmpl_fs from "./omniscriptEditBlockFS.html";
import tmpl_fs_nds from "./omniscriptEditBlockFS_nds.html";

/**
 * @module ns/omniscriptEditBlock
 */
export default class OmniscriptEditBlock extends OmniscriptGroupElement {
  static delegatesFocus = true;

  /**
   * @type {String} - Controls which template to load (Table, FS, Inline, Cards, LongCards). Empty string results in Table
   * @scope api (public)
   */
  @api mode;
  /**
   * @type {Boolean} - Indicates if Edit Block is in edit mode (input fields are editable)
   * @scope track (private)
   */
  @track _isEditing = false;
  /**
   * @type {Boolean} - Indicates if the action menu is visible (Available in Table, Cards, LongCards)
   * @scope track (private)
   */
  @track _bShowActionMenu = false;
  /**
   * @type {Boolean} - Indicates if the checkbox on the top-right corner is visible
   * @scope track (private)
   */
  @track _showCheckbox = false;
  _displayValues = [];
  _hasChildren = false;
  _isNew = false;
  _isFirstIndex = false;
  _hasSumElement = false; // FS
  /**
   * @type {Number} - Controls the maximum number of element values to display
   * @scope private
   */
  _maxDisplayCount = 3;
  _tableLabels = [];
  _oldData;
  _gActions = [];
  _actionMenuList = [];
  _useActionMenu = false;
  _tableWidth = { 1: 12, 2: 6, 3: 4, 4: 3, 5: 2, 6: 2 };
  _actionMenuText = "";
  _menuExpanded = false;
  _svgIcon = "";

  /**
   * Creates a new Edit Block.
   * @param {Object} evt - Event object when attached to an event listener, String when executed programatically
   * @param {Object} seed
   * @scope public
   * @returns {void}
   */
  @api
  handleAdd(evt, seed) {
    // the very first one, need to set this._isEditing = true
    if (
      this.jsonDef.index === 0 &&
      (!this.jsonDef.childrenC ||
        (this.jsonDef.childrenC &&
          this.jsonDef.children.length !== this.jsonDef.childrenC.length))
    ) {
      if (evt !== "api") {
        this.isEditing = true;
        this._isNew = true;
      }
      this.handleRepeat("ebfirstadd", seed);
    } else {
      this.handleRepeat("update", seed);
    }
    if (evt !== "api") {
      this.dispatchEvent(
        new CustomEvent("omnieditblockadd", {
          bubbles: true,
          composed: true
        })
      );
    }
  }

  /**
   * Deletes current Edit Block.
   * @scope private
   * @returns {void}
   */
  handleRemoveDom() {
    if (this.canRemove) {
      if (this.jsonDef.ct === 1) {
        this.handleRepeat("eblastdel");
        this._elementValueObj = {};
      } else {
        this.handleRepeat("delete");
      }
      this.dispatchEvent(
        new CustomEvent("omnieditblockremove", {
          bubbles: true,
          composed: true
        })
      );
    }
  }

  /**
   * Call any action overriding delete; otherwise handleRemoveDom will be called.
   * @scope private
   * @returns {void}
   */
  handleRemove(evt) {
    if (this.canRemove) {
      const invokeAction = this._propSetMap.delAction;

      if (invokeAction && evt !== "api") {
        runAction(this, invokeAction).then((resp) => {
          if (!resp.error) {
            this.handleRemoveDom();
          } else {
            displayErrorModal(this, resp.errorMsg);
          }
        });
      } else {
        this.handleRemoveDom();
      }
    }
  }

  /**
   * Handle keyboard "Enter" or "Space" for add
   * @param {Object} evt - Event object when attached to an event listener, String when executed programatically
   * @param {Object} seed
   * @scope private
   * @returns {void}
   */
  handleKeyboardAdd(evt, seed) {
    if (evt.key === "Enter") {
      evt.preventDefault();
      this.handleAdd(evt, seed);
    }
  }

  /**
   * Handle keyboard "Enter" or "Space" for remove
   * @param {Object} evt - Event object when attached to an event listener, String when executed programatically
   * @scope private
   * @returns {void}
   */
  handleKeyboardRemove(evt) {
    if (evt.key === "Enter") {
      evt.preventDefault();
      this.remove(evt);
    }
  }

  /**
   * Handle keyboard "Enter" or "Space" for edit
   * @param {Object} evt - Event object when attached to an event listener, String when executed programatically
   * @scope private
   * @returns {void}
   */
  handleKeyboardEdit(evt) {
    if (evt.key === "Enter") {
      evt.preventDefault();
      this.edit(evt);
    }
  }
  /**
   * Handle keyboard "Enter" or "Space" for save
   * @param {Object} evt - Event object when attached to an event listener, String when executed programatically
   * @scope private
   * @returns {void}
   */
  handleKeyboardSave(evt) {
    if (evt.key === "Enter") {
      evt.preventDefault();
      this.save(evt);
    }
  }

  /**
   * Handle keyboard "Enter" or "Space" for cancel
   * @param {Object} evt - Event object when attached to an event listener, String when executed programatically
   * @scope private
   * @returns {void}
   */
  handleKeyboardCancel(evt) {
    if (evt.key === "Enter") {
      evt.preventDefault();
      this.cancel();
    }
  }

  /**
   * Handle keyboard "Enter" or "Space" for checkbox
   * @param {Object} evt - Event object when attached to an event listener, String when executed programatically
   * @scope private
   * @returns {void}
   */
  handleKeyboardCheckbox(evt) {
    if (evt.key === "Enter") {
      evt.preventDefault();
      this.handleCheckbox(evt);
    }
  }

  /**
   * Handle keyboard "Enter" or "Space" for action menu
   * "Esc" to close the action menu
   * @param {Object} evt - Event object when attached to an event listener, String when executed programatically
   * @scope private
   * @returns {void}
   */
  handleKeyboardActionMenu(evt) {
    if (evt.key === "Enter") {
      evt.preventDefault();
      this.toggleActionMenu(evt);
    } else if (evt.key === "Escape" || evt.key === "Esc") {
      //Hide menu when Esc key is pressed
      this.hideActionMenu();
    } else if (evt.key === "Down" || evt.key === "ArrowDown") {
      evt.preventDefault();
      this.toggleActionMenu(evt);
    }
  }

  /**
   * Displays remove confirmation modal and then calls handleRemove.
   * @param {Object} evt - Event Object
   * @scope private
   * @returns {void}
   */
  remove(evt) {
    if (this.canRemove) {
      if (evt) {
        evt.stopPropagation();
      }
      // passing entire modal configuration and controlling when the modal closes
      const modalDetails = {
        type: "info",
        message: this.allCustomLabelsUtil.OmniEditBlockDeleteConfirmation,
        header: this.allCustomLabelsUtil.OmniConfirm,
        buttons: [
          {
            label: this.allCustomLabelsUtil.OmnicancelLabel,
            key: "0-Cancel",
            handleClick: () => {
              let focusOnCancel =
                this.template.querySelector(`[data-remove-button]`);
              if (!focusOnCancel) {
                focusOnCancel = this.template.querySelector(
                  `[data-action-button-menu]`
                );
              }
              if (focusOnCancel && typeof focusOnCancel.focus === "function") {
                focusOnCancel.focus();
              }
            }
          },
          {
            label: this.allCustomLabelsUtil.OmniOK,
            key: "1-Ok",
            handleClick: () => {
              this.handleRemove();
              this.isEditing = false;
            }
          }
        ],
        closeAfterClick: true
      };
      this.dispatchOmniEventUtil(this, modalDetails, "omnimodal");
    }
  }

  /**
   * Indicates if deleting an Edit Block is allowed
   * @scope private
   * @returns {Boolean}
   */
  get canRemove() {
    // when edit block is newly created but not yet saved, allow delete
    return this._allowDelete || this._isNew;
  }

  /**
   * Disables edit mode, ignores new data, and restores the previous data.
   * @scope private
   * @returns {void}
   */
  cancel() {
    if (this._isNew) {
      // is recently added?
      this.handleRemoveDom();
      this.dispatchEvent(
        new CustomEvent("omnieditblockcancel", {
          bubbles: true,
          composed: true
        })
      );
    } else {
      // generate old data based off of current json data
      const modifiedOldData = this.createNullifiedJsonData(
        this._oldData,
        this.jsonDef.response ? this.jsonDef.response : {}
      );
      // re-apply the old value
      this.applyCallResp(modifiedOldData, true, false, true, false);
    }
    this.isEditing = false;
    if (this.mode === "Cards") {
      pubsub.fire(
        "focusToNewButton_" + this.jsonDef.name + this.scriptHeaderDef.uuid,
        "data",
        { data: "data" }
      );
    } else {
      pubsub.fire(
        "focusToNewButtonFromCancel_" +
          this.jsonDef.name +
          this.scriptHeaderDef.uuid,
        "data",
        { data: "data" }
      );
    }
  }

  /**
   * Updates all Edit Blocks' checkbox if select mode is enabled
   * @param {Object} evt - Event Object
   * @scope private
   * @returns {void}
   */
  handleCheckbox(evt) {
    if (evt) {
      evt.stopPropagation();
    }

    if (this.jsonDef) {
      if (this._propSetMap.selectMode === "Single") {
        this.updateCheckbox(true);
      } else {
        this.updateCheckbox();
      }
    }
  }

  /**
   * Notifies other siblings in current Edit Block that something has been updated
   * @param {Object} data
   * @scope private
   * @returns {void}
   */
  updateSiblings(data) {
    // only short cards should trigger handleAdd in this manner
    if (
      this._isCards &&
      data &&
      data.add &&
      data.addIndex === this.jsonDef.index
    ) {
      this.handleAdd();
    } else if (
      data &&
      data.checkbox &&
      data.checkboxIndex !== this.jsonDef.index
    ) {
      this.updateCheckbox(false);
    } else if (data.reset) {
      this.reset();
    }
  }

  /**
   * Controls the selection of the Edit Block given a checkbox element specified
   * inside of the Edit Block
   * The selection controls either :
   * 1. affects the background color (table)
   * 2. toggles the visibility of the checkbox (cards, longcards)
   * @param {Boolean} sending - Indicates if current Edit Block child is the sender or receiver of the update.
   * @scope private
   * @returns {void}
   */
  updateCheckbox(sending = false) {
    if (this.jsonDef) {
      let checkboxName = this._propSetMap.selectCheckBox;
      if (checkboxName !== "" && checkboxName in this.jsonDef.response) {
        let currentValue = this.jsonDef.response[checkboxName];
        let resp = {};
        let update = false;

        if (this._propSetMap.selectMode === "Multi") {
          resp[checkboxName] = !currentValue;
          this._showCheckbox = resp[checkboxName];
          update = true;
        } else if (this._propSetMap.selectMode === "Single") {
          if (!sending && currentValue !== false) {
            // receiving
            resp[checkboxName] = false;
            this._showCheckbox = false;
            update = true;
          } else if (sending) {
            // sending
            resp[checkboxName] = !currentValue;
            this._showCheckbox = !currentValue;
            update = true;
            pubsub.fire(
              this.jsonDef.name + "_" + this.scriptHeaderDef.uuid,
              "data",
              {
                checkbox: true,
                checkboxIndex: this.jsonDef.index
              }
            );
          }
        }
        // only update if any changes are required
        if (update) {
          this.applyCallResp(resp, false, false, true, false);
        }
      }
    }
  }

  /**
   * Sets the editing mode to true
   * @scope private
   * @returns {void}
   */
  edit() {
    if (this._allowEdit) {
      //default edit button
      this.isEditing = true;
      this._oldData = JSON.parse(JSON.stringify(this.jsonDef.response));
    }
  }

  // NOTE - this.applyCallResp(resp.result, true, false);
  // bApi = true, we need to integrate it with Group element validation
  /**
   * Saves any changes to Edit Block, calls overridden actions for (new, edit and delete)
   * @scope private
   * @returns {void}
   */
  save() {
    if (this.reportValidity()) {
      // FS is a beast because it allows multiple rows to be editted at the same time
      // this can throw off the assistive text count logic in edit block wrapper.
      if (!this._isFS || (this._isFS && this._isNew)) {
        this.dispatchEvent(
          new CustomEvent("omnieditblocksave", {
            bubbles: true,
            composed: true
          })
        );
      }
      const invokeAction = this._isNew
        ? this._propSetMap.newAction
        : this._propSetMap.editAction;

      if (invokeAction) {
        runAction(this, invokeAction).then((resp) => {
          if (!resp.error) {
            if (resp.result) {
              this.applyCallResp(resp.result, true, false, true, true);
            }

            this.isEditing = false;
            this._isNew = false;
            if (this.mode === "Cards") {
              pubsub.fire(
                "focusToNewButton_" +
                  this.jsonDef.name +
                  this.scriptHeaderDef.uuid,
                "data",
                { data: "data" }
              );
            } else {
              Promise.resolve().then(() => {
                const newEl = this.template.querySelector(".editblock-new");
                if (newEl) {
                  newEl.focus();
                }
              });
            }
          } else {
            displayErrorModal(this, resp.errorMsg).then(() => {
              if (this.mode === "Cards") {
                pubsub.fire(
                  "focusToNewButton_" +
                    this.jsonDef.name +
                    this.scriptHeaderDef.uuid,
                  "data",
                  { data: "data" }
                );
              } else {
                Promise.resolve().then(() => {
                  const newEl = this.template.querySelector(".editblock-new");
                  if (newEl) {
                    newEl.focus();
                  }
                });
              }
            });
          }
        });
      } else {
        this.updateDisplayColumns();
        this.isEditing = false;
        this._isNew = false;
        if (this.mode === "Cards") {
          pubsub.fire(
            "focusToNewButton_" + this.jsonDef.name + this.scriptHeaderDef.uuid,
            "data",
            { data: "data" }
          );
        } else {
          // eslint-disable-next-line @lwc/lwc/no-async-operation
          setTimeout(() => {
            Promise.resolve().then(() => {
              const newEl = this.template.querySelector(".editblock-new");
              if (newEl) {
                newEl.focus();
              }
            });
          }, 0);
        }
      }
    } else {
      this.handleInvalid();
    }
  }

  /**
   * Indicates if edit mode is enabled
   * @scope private
   * @returns {Boolean}
   */
  get isEditing() {
    return this._isEditing;
  }

  /**
   * Sets the value for edit mode
   * @param {Boolean} value - new Boolean value to enable or disable edit mode
   * @scope private
   * @returns {void}
   */
  set isEditing(value) {
    if (this._isEditing !== value) {
      this._isEditing = value;

      if (
        this._isInline ||
        this._isFS ||
        this.mode === "Inline" ||
        this.mode === "FS"
      ) {
        this.editModeNotify(this._isEditing);
      }
      if (this._isEditing) {
        Promise.resolve().then(() => {
          if (this.firstFocusableElement) {
            this.firstFocusableElement.focus();
          }
        });
      }
    }
  }

  /**
   * Sends an event to the header to prevent omniscript from navigating to prev/next steps
   * @scope private
   * @returns {void}
   */
  editModeNotify(hasPendingUpdate) {
    const detail = {
      pendingUpdates: hasPendingUpdate
    };
    this.dispatchOmniEventUtil(this, detail, "omnipendingupdates");
  }

  /**
   * Toggles the visibility the action menu
   * @param {Object} evt - Event Object
   * @scope private
   * @returns {void}
   */
  toggleActionMenu(evt) {
    if (evt) {
      evt.stopPropagation();
    }
    this._bShowActionMenu = !this._bShowActionMenu;
    this._menuExpanded = !this._menuExpanded;

    if (this._menuExpanded) {
      Promise.resolve().then(() => {
        const firstMenuItem = this.template.querySelector(
          `ul.${this._theme}-dropdown__list li:first-child > a`
        );
        if (firstMenuItem) {
          firstMenuItem.focus();
        }
      });
    }
  }

  /**
   * handles the tab out on action menu
   */
  handleTabOut(evt) {
    if (evt) {
      evt.stopPropagation();
    }
    this.hideActionMenu();
  }

  /**
   * Hides the action menu
   * @param {Object} evt - Event Object
   * @scope private
   * @returns {void}
   */
  hideActionMenu(evt) {
    if (evt) {
      evt.stopPropagation();
    }
    this._bShowActionMenu = false;
    this._menuExpanded = false;
  }

  /**
   * Creates and configures the data for the action menu
   * @scope private
   * @returns {void}
   */
  createActionMenu() {
    this._actionMenuList = [];
    if (this._allowEdit) {
      const actionType = "edit-action";
      let label = this._propSetMap.editLabel; // edit
      if (this._propSetMap.editAction) {
        label = this._propSetMap.editAction.propSetMap.label;
      }
      let actionItem = {
        lwcId: actionType,
        label: label,
        handleClick: (evt) => {
          this.handleClickOrEnter(evt, actionType);
        },
        handleKeyboardClick: (evt) => {
          this.handleKeyOperations(evt, actionType);
        }
      };
      this._actionMenuList.push(actionItem);
    }
    if (this._propSetMap.actions) {
      for (let i = 0; i < this._propSetMap.actions.length; i++) {
        let action = this._propSetMap.actions[i];
        let actionType = i + "-action";
        let actionItem = {
          lwcId: actionType,
          label: action.propSetMap.label,
          handleClick: (evt) => {
            this.handleClickOrEnter(evt, actionType, action);
          },
          handleKeyboardClick: (evt) => {
            this.handleKeyOperations(evt, actionType, action);
          }
        };
        this._actionMenuList.push(actionItem);
      }
    }
    if (this._allowDelete) {
      const actionType = "delete-action";
      let label = this._propSetMap.deleteLabel; // delete
      if (this._propSetMap.delAction) {
        label = this._propSetMap.delAction.propSetMap.label;
      }
      let actionItem = {
        lwcId: actionType,
        label: label,
        handleClick: (evt) => {
          this.handleClickOrEnter(evt, actionType);
        },
        handleKeyboardClick: (evt) => {
          this.handleKeyOperations(evt, actionType);
        }
      };
      this._actionMenuList.push(actionItem);
    }

    this._useActionMenu = this._actionMenuList.length > 0;
  }

  handleKeyOperations(evt, actionType, action) {
    if (evt.key === "Enter") {
      evt.preventDefault();
      this.handleClickOrEnter(evt, actionType, action);
    } else if (evt.key === "Escape" || evt.key === "Esc") {
      //Hide menu when Esc key is pressed
      this.hideActionMenu();
    } else if (evt.key === "Up" || evt.key === "ArrowUp") {
      evt.preventDefault();
      this.handleUpKey();
    } else if (evt.key === "Down" || evt.key === "ArrowDown") {
      evt.preventDefault();
      this.handleDownKey();
    } else if (evt.key === "Tab") {
      this.handleTabOut(evt);
    }
  }

  handleClickOrEnter(evt, actionType, action) {
    if (evt) {
      evt.stopPropagation();
    }
    if (actionType === "edit-action") {
      this.edit();
      this.hideActionMenu();
    } else if (actionType === "delete-action") {
      this.remove();
      this.hideActionMenu();
    } else if (action) {
      runAction(this, action).then((resp) => {
        if (resp.error) {
          displayErrorModal(this, resp.errorMsg);
        } else {
          if (resp.result) {
            this.applyCallResp(resp.result, true, false, true, true);
          }
        }
      });
      this.hideActionMenu();
    }
  }

  handleUpKey() {
    const parent = this.template.activeElement.parentElement;
    const firstItem = this.template.querySelector(
      `ul.${this._theme}-dropdown__list li:first-child`
    );
    const lastItem = this.template.querySelector(
      `ul.${this._theme}-dropdown__list li:last-child`
    );
    let preElement;
    if (parent === firstItem) {
      preElement = lastItem;
    } else {
      preElement = parent.previousElementSibling;
    }
    if (preElement) {
      preElement.firstChild.focus();
    }
  }

  handleDownKey() {
    const parent = this.template.activeElement.parentElement;
    const firstItem = this.template.querySelector(
      `ul.${this._theme}-dropdown__list li:first-child`
    );
    const lastItem = this.template.querySelector(
      `ul.${this._theme}-dropdown__list li:last-child`
    );
    let nextElement;
    if (parent === lastItem) {
      nextElement = firstItem;
    } else {
      nextElement = parent.nextElementSibling;
    }
    if (nextElement) {
      nextElement.firstChild.focus();
    }
  }

  createAggregateNode(bFixProxy, operation) {
    let detail = super.createAggregateNode(bFixProxy, operation);
    detail.repeat = true; //set this for applyCallResp to work properly for repeating elements
    return detail;
  }

  initCompVariables() {
    super.initCompVariables();

    // backwards compat, template name will override the mode property to determine template to use
    this._isInline = this.mode === "Inline";
    this._isFS = this.mode === "FS";
    this._isTable = this.mode === "Table" || this.mode === "";
    this._isCards = this.mode === "Cards";
    this._isLongCards = this.mode === "LongCards";

    let templateName = this._propSetMap.HTMLTemplateId;

    let hasTemplate =
      this._isInline ||
      this._isFS ||
      this._isTable ||
      this._isCards ||
      this._isLongCards;

    if (!hasTemplate) {
      if (templateName === "vlcEditBlockInline.html") {
        this._isInline = true;
      } else if (templateName === "vlcEditBlockFS.html") {
        this._isFS = true;
      } else if (templateName === "vlcEditBlock.html" || templateName === "") {
        this._isTable = true;
      } else if (templateName === "vlcEditBlockCards.html") {
        this._isCards = true;
      } else if (templateName === "vlcEditBlockLongCards.html") {
        this._isLongCards = true;
      }
    }

    if (this._isTable || this._isFS) {
      this._maxDisplayCount = 3;
    }
    this._maxDisplayCount = this._propSetMap.maxDisplay
      ? this._propSetMap.maxDisplay
      : this._maxDisplayCount;

    this._newLabel = this._propSetMap.newLabel;
    if (this._propSetMap.newAction) {
      this._newLabel = this._propSetMap.newAction.propSetMap.label;
    }
    this._editLabel = this._propSetMap.editLabel;
    if (this._propSetMap.editAction) {
      this._editLabel = this._propSetMap.editAction.propSetMap.label;
    }
    this._deleteLabel = this._propSetMap.deleteLabel;
    if (this._propSetMap.delAction) {
      this._deleteLabel = this._propSetMap.delAction.propSetMap.label;
    }
    this._allowNew = this._propSetMap.allowNew;
    this._allowEdit = this._propSetMap.allowEdit;
    this._allowDelete = this._propSetMap.allowDelete;

    this._svgIcon = this._propSetMap.svgSprite + ":" + this._propSetMap.svgIcon;

    if (!this._isInline) {
      this.createActionMenu();
    }
    if (this._isFS) {
      if (this._propSetMap.sumElement !== "") {
        this._hasSumElement = true;
      }
    }

    if (!this._updateSiblingsPubsubObj) {
      this._updateSiblingPubsubObj = {
        data: this.updateSiblings.bind(this)
      };
      pubsub.register(
        this.jsonDef.name + "_" + this.scriptHeaderDef.uuid,
        this._updateSiblingPubsubObj
      );
    }

    if (this._propSetMap.gActions) {
      createGlobalActionList(this, this._propSetMap.gActions);
    }

    this.createTableLabelColumns();
    this.createDisplayColumns();
  }

  /**
   * Overriding omniscriptBaseElement's propToMultiLang to include translations of custom labels inside of global actions, and actions for edit block's new, edit and delete
   * @param {Object} properties
   * @returns {void}
   */
  propToMultiLang(properties) {
    if (this._isDesignMode) return; // skipping translations

    super.propToMultiLang(properties);
    // translate the global action's properties
    if (this._propSetMap.gActions) {
      this._propSetMap.gActions.forEach((gAction) => {
        handleMultiLangLabel(
          gAction.type,
          gAction.propSetMap,
          this.allCustomLabelsUtil
        );
      });
    }
    if (this._propSetMap.actions) {
      this._propSetMap.actions.forEach((action) => {
        handleMultiLangLabel(
          action.type,
          action.propSetMap,
          this.allCustomLabelsUtil
        );
      });
    }
    if (this._propSetMap.newAction) {
      handleMultiLangLabel(
        this._propSetMap.newAction.type,
        this._propSetMap.newAction.propSetMap,
        this.allCustomLabelsUtil
      );
    }
    if (this._propSetMap.editAction) {
      handleMultiLangLabel(
        this._propSetMap.editAction.type,
        this._propSetMap.editAction.propSetMap,
        this.allCustomLabelsUtil
      );
    }
    if (this._propSetMap.delAction) {
      handleMultiLangLabel(
        this._propSetMap.delAction.type,
        this._propSetMap.delAction.propSetMap,
        this.allCustomLabelsUtil
      );
    }
  }

  /**
   * Indicates if data json has been updated
   * @scope private
   * @returns {void}
   */
  stateRefresh() {
    this.updateDisplayColumns();
  }

  /**
   * Creates and configures the data to be displayed for every template
   * @scope private
   * @returns {void}
   */
  createDisplayColumns() {
    if (
      this.jsonDef &&
      this.jsonDef.children &&
      this.jsonDef.children.length > 0 &&
      this.jsonData
    ) {
      this._displayValues = [];
      let preDisplayVal = [];
      // preprocessing to calculate actual number of columns to be displayed
      for (let i = 0; i < this.jsonDef.children.length; i++) {
        let eleArray = this.jsonDef.children[i].eleArray[0];
        // Terence, we might need to check the case where controls under Edit Block becomes repeatable
        if (
          eleArray.propSetMap.disOnTplt &&
          this._maxDisplayCount > preDisplayVal.length
        ) {
          preDisplayVal.push(eleArray);
        }
      }

      // create display objects
      for (let i = 0; i < preDisplayVal.length; i++) {
        let eleArray = preDisplayVal[i];
        let value =
          this.jsonData.OmniScriptFmtData &&
          this.jsonData.OmniScriptFmtData[eleArray.JSONPath];
        value = value == null ? eleArray.response : value;
        value = value == null ? "" : value;

        let cls = `${this._theme}-p-around_small ${this._theme}-truncate`;

        if (this._isFS || this._isTable) {
          let width = 0;
          if (this._isFS) {
            width = eleArray.propSetMap.controlWidth;
          } else if (this._isTable) {
            // automatically determine width of each column based on display count
            width = this._tableWidth[preDisplayVal.length]
              ? this._tableWidth[preDisplayVal.length]
              : 1;
          }
          cls += ` ${this._theme}-size_${width}-of-12`;

          if (eleArray.type === "Checkbox") {
            cls += ` ${this._theme}-grid ${this._theme}-grid_align-center`;
          } else if (
            eleArray.type === "Currency" ||
            eleArray.type === "Number"
          ) {
            cls += ` ${this._theme}-text-align_right`;
          }
        }

        this._displayValues.push({
          lwcId: "lwc" + i,
          value: value, // formatted value,
          label: eleArray.propSetMap.label,
          cls: cls,
          isCheckbox: eleArray.type === "Checkbox"
        });
      }
    }
  }

  /**
   * Updates the display values for all of the elements
   * @scope private
   * @returns {void}
   */
  updateDisplayColumns() {
    if (
      this.jsonDef &&
      this.jsonDef.children &&
      this.jsonDef.children.length > 0 &&
      this.jsonData
    ) {
      if (this._displayValues.length < 1) {
        this.createDisplayColumns();
      } else {
        // update display
        let dvIndex = 0;
        for (let i = 0; i < this.jsonDef.children.length; i++) {
          let eleArray = this.jsonDef.children[i].eleArray[0];
          if (
            eleArray.propSetMap.disOnTplt &&
            dvIndex < this._displayValues.length
          ) {
            let value =
              this.jsonData.OmniScriptFmtData &&
              this.jsonData.OmniScriptFmtData[eleArray.JSONPath];
            value = value == null ? eleArray.response : value;
            value = value == null ? "" : value;
            value = eleArray.bShow === false ? "" : value;
            this._displayValues[dvIndex].value = value;
            dvIndex++;
          }
        }
      }
    }
  }

  /**
   * Creates and configures the labels for the columns in FS and Table
   * @scope private
   * @returns {void}
   */
  createTableLabelColumns() {
    if (this.jsonDef) {
      let preTableLabels = [];
      this._tableLabels = [];
      let children = [];
      if (this.jsonDef.children && this.jsonDef.children.length > 0) {
        children = this.jsonDef.children;
      } else if (this.jsonDef.childrenC && this.jsonDef.childrenC.length > 0) {
        children = this.jsonDef.childrenC;
      }

      for (let i = 0; i < children.length; i++) {
        let eleArray = children[i].eleArray[0];
        // Terence, we might need to check the case where controls under Edit Block becomes repeatable
        if (
          eleArray.propSetMap.disOnTplt &&
          this._maxDisplayCount > preTableLabels.length
        ) {
          preTableLabels.push(eleArray);
        }
      }

      // update table labels
      for (let i = 0; i < preTableLabels.length; i++) {
        let eleArray = preTableLabels[i];
        let cls = `${this._theme}-p-horizontal_small ${this._theme}-truncate`;
        if (this._isFS || this._isTable) {
          let width = 0;
          if (this._isFS) {
            width = eleArray.propSetMap.controlWidth;
          } else if (this._isTable) {
            // automatically determine width of each column based on display count
            width = this._tableWidth[preTableLabels.length]
              ? this._tableWidth[preTableLabels.length]
              : 1;
          }
          cls += ` ${this._theme}-size_${width}-of-12`;

          if (eleArray.type === "Checkbox") {
            cls += ` ${this._theme}-text-align_center`;
          } else if (
            eleArray.type === "Currency" ||
            eleArray.type === "Number"
          ) {
            cls += ` ${this._theme}-text-align_right`;
          }
        }

        let tableLabel =
          eleArray.propSetMap.label && this._multiLang
            ? this.allCustomLabelsUtil[eleArray.propSetMap.label]
            : eleArray.propSetMap.label;
        this._tableLabels.push({
          lwcId: "lwc" + i,
          label: tableLabel,
          cls: cls
        });
      }
    }
  }

  /**
   * Creates an object that contains all of the elements for an edit block with all values set to null
   */
  createNullifiedJsonData(oldData, newData) {
    // traverse through object and nullify fields
    function nullifyObjectProps(olddata, newdata) {
      if (newdata && typeof newdata === "object") {
        if (olddata == null) {
          // create structure in old data if it doesnt exist
          olddata = Array.isArray(newdata) ? [] : {};
        }
        const keys = Object.keys(newdata);
        for (let i = 0; i < keys.length; i++) {
          const propKey = keys[i];
          // recurse
          if (newdata && newdata[propKey]) {
            if (typeof newdata[propKey] === "object") {
              if (olddata[propKey] == null) {
                olddata[propKey] = Array.isArray(newdata) ? [] : {};
              }
              nullifyObjectProps(olddata[propKey], newdata[propKey]);
            }
            // nullify non-object properties, restore existing data saved before editing
            else {
              olddata[propKey] =
                olddata[propKey] != null ? olddata[propKey] : null;
            }
          }
        }
      }
    }
    nullifyObjectProps(oldData, newData);
    return oldData;
  }

  /**
   * Clears display values, and removes child from data json
   * @scope private
   */
  reset() {
    this.handleRemoveDom();
    this._displayValues = [];
  }

  /**
   * Returns the value for the sumElement
   * @scope private
   * @returns {String}
   */
  get sumElement() {
    let formulaMergeField = "%" + this._propSetMap.sumElement + "%";
    return this.handleMergeFieldUtil(
      formulaMergeField,
      this.jsonData,
      this.scriptHeaderDef.labelMap,
      isRepeatNotation(formulaMergeField) ? this.jsonDef.JSONPath : null,
      true
    );
  }

  /**
   * Indicates if adding new Edit Blocks is enabled
   * @scope private
   * @returns {Boolean}
   */
  get canRepeat() {
    return this._allowNew;
  }

  /**
   * Indicates if the add button is visible
   * @scope private
   * @returns {Boolean}
   */
  get showAdd() {
    if (this._isDesignMode) return true;
    return (
      this._allowNew &&
      !this._isEditing &&
      ((this.jsonDef.childrenC &&
        this.jsonDef.children.length !== this.jsonDef.childrenC.length) ||
        this.jsonDef.index === this.jsonDef.ct - 1)
    );
  }

  /**
   * Indicates if there are any invalid elements in the Edit Block
   * @scope private
   * @returns {Boolean}
   */
  get isInvalid() {
    return Object.keys(this.invalidElements).length > 0;
  }

  /**
   * Returns a string containing the sprite and icon for an svg icon
   * @scope private
   * @returns {String}
   */
  get svgMapIcon() {
    let svgIcon = "";
    if (this.jsonDef) {
      if (
        this.jsonDef.response &&
        this._propSetMap.valueSvgMap &&
        this._propSetMap.elementName
      ) {
        let svgMap = this._propSetMap.valueSvgMap;
        for (let i = 0; i < svgMap.length; i++) {
          if (
            svgMap[i].value ===
            this.jsonDef.response[this._propSetMap.elementName]
          ) {
            svgIcon = svgMap[i].svgSprite + ":" + svgMap[i].svgIcon;
          }
        }
      }
      svgIcon =
        svgIcon !== ""
          ? svgIcon
          : this._propSetMap.svgSprite + ":" + this._propSetMap.svgIcon;
    }
    return svgIcon;
  }

  /**
   * Returns the class string for elements displaying non-editable text.
   * @scope private
   * @returns {String}
   */
  get visualClass() {
    if (this._isDesignMode) {
      return this._theme + "-size_1-of-1 " + this._theme + "-hide";
    }
    return (
      this._theme +
      "-size_1-of-1 " +
      this._theme +
      (this._isEditing || !this._hasChildren ? "-hide" : "-show")
    );
  }

  /**
   * Returns the class string for elements displaying the input fields
   * @scope private
   * @returns {String}
   */
  get editClass() {
    return (
      this._theme +
      "-size_1-of-1 " +
      this._theme +
      (this._isEditing ? "-show" : "-hide")
    );
  }

  applyCtrlWidth() {
    super.applyCtrlWidth();
    if (this.jsonDef && this._propSetMap) {
      this.classList.remove(
        this._theme + "-medium-size_" + this._propSetMap.controlWidth + "-of-12"
      );
      this.classList.remove(this._theme + "-show_inline-block");

      if (!this._isDesignMode && this._isCards) {
        this.classList.add(this._theme + "-large-size_3-of-12");
        this.classList.add(this._theme + "-medium-size_6-of-12");
      }
    }
  }

  render() {
    if (this.jsonDef) {
      this._hasChildren = this.jsonDef.children.length > 0;
      this._isFirstIndex = this.jsonDef.index === 0;

      if (this._isCards && this._isFirstIndex) {
        // hides the first short card with no children
        // using size 0 to prevent omnishow from removing the class
        if (!this._isDesignMode) {
          if (!this._hasChildren) {
            this.classList.add(this._theme + "-size_0-of-12");
          } else {
            this.classList.remove(this._theme + "-size_0-of-12");
          }
        }
      }
    }
    let template = tmpl_blank; //no mode specified will result in a blank template
    if (this.layout === "newport") {
      if (this._isFS) {
        template = tmpl_fs_nds;
      } else if (this._isLongCards || this._isCards) {
        template = tmpl_card_nds;
      } else if (this._isTable) {
        template = tmpl_table_nds;
      } else if (this._isInline) {
        template = tmpl_inline_nds;
      }
    } else {
      if (this._isFS) {
        template = tmpl_fs;
      } else if (this._isLongCards || this._isCards) {
        template = tmpl_card;
      } else if (this._isTable) {
        template = tmpl_table;
      } else if (this._isInline) {
        template = tmpl_inline;
      }
    }
    return template;
  }

  connectedCallback() {
    if (this.jsonDef.newClone === true) {
      // need to handle the api case
      this.isEditing = true;
      this._isNew = true;
    }

    super.connectedCallback();

    // Set the alternative-text string for action menu button
    this._actionMenuText = `${this.allCustomLabelsUtil.OmniEditBlockActionMenuText} ${this.jsonDef.index}`;
    this._handleKeyDownOnLastElementInModal =
      this.handleKeyDownOnLastElementInModal.bind(this);
    this._handleKeyDownOnFirstElementInModal =
      this.handleKeyDownOnFirstElementInModal.bind(this);
    if (this._isLongCards) {
      this.setAttribute("role", "listitem");
    }

    if ((this._isInline || this._isCards || this._isFS) && this._isEditing) {
      Promise.resolve().then(() => {
        if (this.firstFocusableElement) {
          this.firstFocusableElement.focus();
        }
      });
    }

    if (!this._focusCancelPubsubObj) {
      this._focusCancelPubsubObj = {
        data: this.focusOnNewFromCancel.bind(this)
      };
      pubsub.register(
        "focusToNewButtonFromCancel_" +
          this.jsonDef.name +
          this.scriptHeaderDef.uuid,
        this._focusCancelPubsubObj
      );
    }
  }

  focusOnNewFromCancel() {
    if (this.showAdd) {
      Promise.resolve().then(() => {
        const newEl = this.template.querySelector(".editblock-new");
        if (newEl) {
          newEl.focus();
        }
      });
    }
  }

  handleKeyDownOnLastElementInModal(event) {
    const isTabPressed = event.key === "Tab" || event.keyCode === 9;

    if (!isTabPressed) {
      return;
    }

    // ignore if shiftkey is held down
    if (!event.shiftKey && this.firstFocusableElement) {
      // if focused has reached to last focusable element then focus first focusable element after pressing tab
      this.firstFocusableElement.focus();
      event.preventDefault();
    }
  }

  handleKeyDownOnFirstElementInModal(event) {
    const isTabPressed = event.key === "Tab" || event.keyCode === 9;

    if (!isTabPressed) {
      return;
    }

    // if shiftkey is held down then we're going backwards and should end up on last element
    if (event.shiftKey && this.lastFocusableElement) {
      // if focused has reached to last focusable element then focus first focusable element after pressing tab
      this.lastFocusableElement.focus();
      event.preventDefault();
    }
  }

  disconnectedCallback() {
    if (this._updateSiblingPubsubObj) {
      pubsub.unregister(
        this.jsonDef.name + "_" + this.scriptHeaderDef.uuid,
        this._updateSiblingPubsubObj
      );
    }
    if (this.lastFocusableElement) {
      this.lastFocusableElement.removeEventListener(
        "keydown",
        this._handleKeyDownOnLastElementInModal
      );
    }
    if (this.previousFirstFocusableElement) {
      this.previousFirstFocusableElement.removeEventListener(
        "keydown",
        this._handleKeyDownOnFirstElementInModal
      );
    }
    if (this._focusCancelPubsubObj) {
      pubsub.unregister(
        "focusToNewButtonFromCancel_" +
          this.jsonDef.name +
          this.scriptHeaderDef.uuid,
        this._focusCancelPubsubObj
      );
    }
  }

  @api
  applyCallResp(
    data,
    bApi = false,
    bValidation = false,
    bSkipPromise,
    bRefreshUI
  ) {
    if (this._propSetMap.allowClear && data === null) {
      // tell all siblings that they will be removed
      pubsub.fire(this.jsonDef.name + "_" + this.scriptHeaderDef.uuid, "data", {
        reset: true
      });
    } else if (data !== undefined) {
      super.applyCallResp(data, bApi, bValidation);
      if (!bSkipPromise) {
        Promise.resolve().then(() => {
          this.updateDisplayColumns();
        });
      } else if (bRefreshUI) {
        this.updateDisplayColumns();
      }
    }
  }

  /**
   * Indicates if there any Edit Blocks created
   * @scope public
   * @returns {Boolean}
   */
  @api
  isEmpty() {
    return (
      this.jsonDef.index === 0 &&
      this.jsonDef.children &&
      this.jsonDef.children.length !== this.jsonDef.childrenC.length
    );
  }

  renderedCallback() {
    super.renderedCallback();
    if (this.jsonDef.index === 0 && this.jsonDef["$Vlocity.seed"]) {
      this.applyCallResp(this.jsonDef["$Vlocity.seed"], true);
      this.dispatchOmniEventUtil(
        this,
        {
          path: this._jsonPath,
          elementId: this._elementId,
          node: "$Vlocity.seed",
          operation: "delete"
        },
        "omniupdatejsondef"
      );
    }

    const checkboxName = this._propSetMap.selectCheckBox;
    if (
      this.jsonDef.response &&
      checkboxName !== "" &&
      checkboxName in this.jsonDef.response &&
      this._showCheckbox !== this.jsonDef.response[checkboxName]
    ) {
      this._showCheckbox = this.jsonDef.response[checkboxName];
      if (this._propSetMap.selectMode === "Single") {
        pubsub.fire(
          this.jsonDef.name + "_" + this.scriptHeaderDef.uuid,
          "data",
          { checkbox: true, checkboxIndex: this.jsonDef.index }
        );
      }
    }

    if (!this.lastFocusableElement) {
      if (!this._isInline) {
        this.lastFocusableElement = this.template.querySelector(
          '[role="dialog"] button:last-child'
        );
      } else if (this._isInline && this.isEditing) {
        this.lastFocusableElement =
          this.template.querySelector("button:last-child");
      }
      if (this.lastFocusableElement) {
        this.lastFocusableElement.addEventListener(
          "keydown",
          this._handleKeyDownOnLastElementInModal
        );
      }
    }

    if (
      this.previousFirstFocusableElement !== this.firstFocusableElement &&
      this.firstFocusableElement
    ) {
      if (this.previousFirstFocusableElement) {
        this.previousFirstFocusableElement.removeEventListener(
          "keydown",
          this._handleKeyDownOnFirstElementInModal
        );
      }
      this.firstFocusableElement.addEventListener(
        "keydown",
        this._handleKeyDownOnFirstElementInModal
      );
      this.previousFirstFocusableElement = this.firstFocusableElement;
    }
  }

  get firstFocusableElement() {
    return this.querySelector("slot > *");
  }

  getBoundsForDesigner() {
    const container = this.template.querySelector(".omni-edit-block-container");
    const outerWrapper = this.getBoundingClientRect();

    const outerWrapperClone = () => {
      const { top, right, bottom, left, width, height, x, y } = outerWrapper;
      return { top, right, bottom, left, width, height, x, y };
    };

    let outerWrapperboundingRectCloned = outerWrapperClone();

    if (container) {
      const computedStyle = getComputedStyle(container);
      const boundingRect = container.getBoundingClientRect();

      const boundingRectClone = () => {
        const { top, right, bottom, left, width, height, x, y } = boundingRect;
        return { top, right, bottom, left, width, height, x, y };
      };

      let boundingRectCloned = boundingRectClone();

      boundingRectCloned.top = boundingRectCloned.top + 30;
      boundingRectCloned.height = boundingRectCloned.height - 30;

      return Object.assign({}, outerWrapperboundingRectCloned, {
        containerBounds: boundingRectCloned,
        paddingLeft: this.safeParseStyleToNumber(computedStyle.paddingLeft),
        paddingRight: this.safeParseStyleToNumber(computedStyle.paddingRight),
        paddingTop: this.safeParseStyleToNumber(computedStyle.paddingTop),
        paddingBottom: this.safeParseStyleToNumber(computedStyle.paddingBottom)
      });
    }

    if (this._isCards) {
      outerWrapperboundingRectCloned.height = 216;
    }

    return outerWrapperboundingRectCloned;
  }

  get designerLabelClass() {
    return `${this._theme}-form-element__label ${this._theme}-m-bottom_x-small ${this._theme}-section-title`;
  }

  omniShow() {
    super.omniShow();
    this.dispatchEvent(
      new CustomEvent("omnieditblockshow", {
        bubbles: true,
        composed: true,
        detail: {
          show: this._omniShow
        }
      })
    );
  }
}
