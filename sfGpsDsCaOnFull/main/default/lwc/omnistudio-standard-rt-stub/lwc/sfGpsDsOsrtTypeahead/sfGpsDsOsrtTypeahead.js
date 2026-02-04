import { LightningElement, api, track } from "lwc";
import pubsub from "c/sfGpsDsOsrtPubsub";
import { debounce, delay } from "c/sfGpsDsOsrtAsyncUtils";
import { typeaheadLabels as translatedLabels } from "c/sfGpsDsOsrtSalesforceUtils";
import {
  lwcPropertyNameConversion,
  listboxScrollUpDown
} from "c/sfGpsDsOsrtUtility";

import sldsTemplate from "./typeahead_slds.html";
import ndsTemplate from "./typeahead_nds.html";

/**
 * @module c/typeahead
 * @typicalname typeahead
 * @slots iconLeft, iconRight, lastItem
 * @example
 * ```
 * <c-sf-gps-ds-osrt-typeahead label={string}
 *              options={array}
 *              theme={"slds"|"nds"}
 *              onchange={changeHandler}
 *              onkeyup={keyupHandler}
 *              icon-name-left={string}
 *              icon-name-right={string}
 *              required={boolean}
 *              disable-filter={boolean}
 *              remote-source={boolean}>
 * </c-sf-gps-ds-osrt-typeahead>
 * ```
 */

export default class VlocityTypeahead extends LightningElement {
  /**
   * Delay in ms to delay the blur event. This allows for the select
   * event to propagate before blur.
   * @type {number}
   * @scope static
   */
  static BLUR_DELAY = 250;
  @api theme = "slds";
  @api label;
  @api type;
  @api disabled;
  @api required;
  @api maxLength;
  @api minLength;
  @api readonly;
  @api readOnly; //obsolete
  @api placeholder;
  @api messageWhenValueMissing = translatedLabels.cmpFieldRequired;
  @api messageWhenTooShort = translatedLabels.cmpFieldTooShort;
  @api messageWhenTooLong = translatedLabels.cmpFieldTooLong;
  @api name;
  @api iconUrl;
  @api fieldLevelHelp;
  @api fieldLevelHelpPosition;
  @api disableLastItem = false;
  @api iconSize = "x-small";
  @api tabIndex;
  /**
   * @type {boolean} - When boolean attribute disable-filter is applied, then no filtering will be applied
   * to the options array on keyup. For use when backend system is filtering.
   * @scope api (public)
   */
  @api disableFilter = false;
  /**
   * @type {boolean} - When boolean attribute remote-source is applied a progress bar will be displayed
   * while options are retrieved.
   * @scope api (public)
   */
  @api remoteSource = false;

  @api hasSlotIconRight;

  @api allowNewValues;

  @api resetDropdownwidth;

  @track iconPosition = null;
  @track internaldata = [];
  @track _value = "";
  @track isError = false;
  @track errorMessage;
  @track isLeftIcon;
  @track isRightIcon;
  @track lastItemClass;
  @track _options;
  @track activeDescendant = null;
  @track hasLastItemSlot = false;
  @track _editLabel = translatedLabels.cmpEdit;
  /**
   * Css classes applied to show or hide the child progress bar element.
   * @type {string}
   * @scope track (string)
   */
  @track showProgress;

  /**
   * @type {boolean} - Controls the display of the typeahead's combo box.
   * @scope track (private)
   */
  @track isLookupVisible = false;

  /**
   * @type {HTMLInputElement} - A reference to the embedded html input. Set in renderedCallback.
   * @scope private
   */
  input;

  /**
   * @type {boolean} - Used to control the flow of renderedCallback.
   * @scope private
   */
  firstRender = true;

  /**
   * @type {boolean} - Used in calculating the visibility of the lookup list.
   * @scope private
   */
  _isFocused = false;

  /**
   * @type {ValidityState} - A reference to the embedded html input's validity state.
   */
  @api get validity() {
    if (!this.input) return { valid: true };

    return this.input.validity;
  }

  /**
   * @type {ProgressBar}
   */
  _progressBar;
  _iconNameLeft;
  _iconNameRight;
  _requiredLabel = translatedLabels.cmpRequired;
  _listboxNode;
  _lastKeydownKey;

  @api get requiredLabel() {
    return this._requiredLabel;
  }
  set requiredLabel(val) {
    if (val) {
      this._requiredLabel = val;
    } else {
      this._requiredLabel = translatedLabels.cmpRequired;
    }
  }

  @api get value() {
    return this._value;
  }
  set value(value) {
    this.setValue(value);
  }

  @api get options() {
    return this._options;
  }
  set options(value) {
    if (value && Array.isArray(value)) {
      this._options = value.map((item, index) => {
        return Object.assign(
          {
            id: item.id || (item.Id && item.Id.value) || index,
            name: typeof item === "string" ? item : item.name || "",
            itrKey: this.getKey
          },
          item
        );
      });
    } else {
      this._options = [];
    }
    this.sortOptions();
    this.filterOptions();
    this.showLookup(this._isFocused && this._options.length > 0);
    if (this.remoteSource) this.progressComplete();
  }

  _sorted = false;
  @api get sorted() {
    return this._sorted;
  }

  set sorted(val) {
    this._sorted = val === "true" || val === true ? true : false;
    if (Array.isArray(this._options)) {
      this.sortOptions();
    }
  }

  @api sortField;
  @api dropdownDirection = "left";
  /** This function sorts the options in alphabetical order of name, or if any other sortField is defined  */
  sortOptions() {
    if (!this.sorted) return;
    let sortedOptions = this._options.sort((a, b) => {
      // If this.sortField is there then sort according to that
      const item1 =
        this.sortField && typeof this.sortField === "string"
          ? a[this.sortField]
          : a.name;
      const item2 =
        this.sortField && typeof this.sortField === "string"
          ? b[this.sortField]
          : b.name;
      return item1 < item2 ? -1 : item1 > item2 ? 1 : 0;
    });
    this._options = [...sortedOptions];
  }

  @api setValue(value) {
    this._value = value == null ? "" : value;
  }

  @track styleProperties = {
    label: {},
    value: {}
  };

  @api get styles() {
    return this._styles;
  }

  set styles(val) {
    const validObj = (str) => {
      try {
        return JSON.parse(str);
      } catch (e) {
        return {};
      }
    };

    val = val ? (typeof val === "string" ? validObj(val) : val) : {};
    val = val.styles ? val.styles : val;
    this._styles = val;
    if (this._styles) {
      for (let key in this._styles) {
        if (this._styles.hasOwnProperty(key)) {
          this.styleProperties[key] = {};
          if (key === "label") {
            this.styleProperties.label.styles = "";
            this.updateStyles(this._styles[key], key);
            this.styleProperties.label.styles += "width:auto;";
          } else if (key === "value") {
            this.updateStyles(this._styles[key], key);
          }
        }
      }
    }
  }

  @api get iconNameLeft() {
    return this._iconNameLeft;
  }
  set iconNameLeft(val) {
    this._iconNameLeft = val;
    this.updateIconPositionValues();
  }
  @api get iconNameRight() {
    return this._iconNameRight;
  }
  set iconNameRight(val) {
    this._iconNameRight = val;
    this.updateIconPositionValues();
  }

  updateStyles(styleObj, styleKey) {
    let keys = Object.keys(styleObj);
    keys.forEach((key) => {
      if (key !== "textAlign" || styleKey !== "label") {
        if (!this.styleProperties[styleKey].styles) {
          this.styleProperties[styleKey].styles = "";
        }
        this.styleProperties[styleKey].styles += `${lwcPropertyNameConversion(
          key
        )}:${styleObj[key]};`;
      } else {
        let labelEles = this.template.querySelectorAll('[data-label="true"]');
        if (labelEles && labelEles.length) {
          labelEles[0].style.textAlign = styleObj[key];
          labelEles[0].style.display = "block";
        }
      }
    });
  }

  translatedLabels = {};

  updateIconPositionValues() {
    this.isLeftIcon = this.iconNameLeft || false;
    this.isRightIcon = this.iconNameRight || false;
    if (this.isLeftIcon && this.isRightIcon) {
      this.iconPosition = "left-right";
    } else if (this.isLeftIcon) {
      this.iconPosition = "left";
    } else if (this.isRightIcon) {
      this.iconPosition = "right";
    }
  }

  //#region lifecycle hooks
  connectedCallback() {
    this.lastItemClass = `${this.theme}-hide`;
    this.updateIconPositionValues();
    this.translatedLabels = translatedLabels;
  }

  render() {
    if (this.theme === "nds") {
      return ndsTemplate;
    }
    return sldsTemplate;
  }
  triggerEvent = (event) => {
    if (event) {
      this.dispatchEvent(
        new CustomEvent(event.type, {
          bubbles: true,
          composed: true
        })
      );
    }
  };

  renderedCallback() {
    if (typeof this.options === "string") {
      this.options = JSON.parse(this.options);
    }

    if (this.firstRender) {
      this.input = this.template.querySelector("input");

      if (this.readonly) {
        this.input.setAttribute("readonly");
      }
      this._progressBar = this.template.querySelector("[data-progress-bar]");

      ["focus", "input"].forEach((event) => {
        this.input.addEventListener(event, this.triggerEvent);
      });

      if (this.remoteSource) this.progressReset();

      this.firstRender = false;
    }

    if (this.theme === "nds" && this.input) {
      if (this.input.value)
        this.input.classList.add("nds-not-empty", "nds-is-dirty");
      else this.input.classList.remove("nds-not-empty", "nds-is-dirty");
    }
    if (!this.dropdownTrigger) {
      this.dropdownTrigger = this.template.querySelector(
        `.${this.theme}-dropdown-trigger_click`
      );
    }
  }
  disconnectedCallback() {
    if (this.input) {
      ["focus", "input"].forEach((event) => {
        this.input.removeEventListener(event, this.triggerEvent);
      });
    }
  }
  //#endregion lifecycle hooks

  get errorClass() {
    return `${this.isError ? `${this.theme}-has-error` : ``}`;
  }

  get typeaheadFormElementClass() {
    const formClasses =
      this.theme === "nds"
        ? " nds-form-element__control nds-form-element__control-animated-label"
        : "";
    return `${this.theme}-combobox__form-element ${
      this.iconPosition !== null
        ? `${this.theme}-input-has-icon ${this.theme}-input-has-icon_${this.iconPosition} ${formClasses}`
        : `${formClasses}`
    }`;
  }

  /**
   * Event handler covering both focus and blur events.
   * @param {Event} evt
   * @scope private
   */
  focusChange(evt) {
    if (evt.type === "focus") {
      this._isFocused = true;
      this.filterOptions();
      let showFlag = this.options && this.options.length > 0;
      if (!showFlag && this.hasLastItemSlot) {
        showFlag = true;
      }
      this.setItemSelected(-1);
      if (this.hasLastItemSlot) {
        this.setLastItemSelected(false);
      }
      this.showLookup(showFlag);
    } else if (evt.type === "blur") {
      delay(VlocityTypeahead.BLUR_DELAY).then(() => {
        this._isFocused = false;
        this.showLookup(false);
        this.closeTooltip();

        // Reset listboxNode
        if (this._lastKeydownKey && this._listboxNode) {
          this._listboxNode = null;
        }

        if (
          this.options.filter((item) => {
            return item.name === this._value;
          }).length === 0
        ) {
          if (this.allowNewValues) {
            this.input.value = this._value;

            pubsub.fire(this.name, "valuechange", {
              name: this.name,
              value: this._value
            });

            this.dispatchEvent(
              new CustomEvent("select", {
                bubbles: true,
                composed: true,
                detail: {
                  name: this._value
                }
              })
            );
          }
        }
        this.dispatchEvent(
          new CustomEvent("blur", {
            bubbles: true,
            composed: true,
            detail: {
              name: this._value
            }
          })
        );
      });
      if (this.newValue !== this._value) {
        this.newValue = this._value;
        this.dispatchEvent(
          new CustomEvent("change", {
            bubbles: true,
            composed: true,
            detail: {
              name: this._value
            }
          })
        );
      }
    }
  }

  closeTooltip() {
    const tooltip = this.template.querySelector("[data-field-level-help]");
    if (tooltip) {
      tooltip.closeTooltip();
    }
  }

  /**
   * Method which controls the visibility of lookup.
   * @param {boolean} isVisible - When true lookup list will be visible.
   */
  showLookup(isVisible) {
    this.isLookupVisible = isVisible;
    if (this.dropdownTrigger) {
      this.dropdownTrigger.classList.toggle(`${this.theme}-is-open`, isVisible);
    }
    if (isVisible) {
      this.announceScrollMessage();
      this.dispatchEvent(
        new CustomEvent("lookupfocus", {
          bubbles: true,
          composed: true
        })
      );
    }
  }

  announceScrollMessage() {
    const announcementContainer = this.template.querySelector(
      ".slds-assistive-text"
    );
    if (announcementContainer) {
      announcementContainer.innerText =
        translatedLabels.searchDropdownAssertiveMessage;
      announcementContainer.focus();
      // Add a delay before clearing the announcement to avoid voice over interruptions.
      delay(2000).then(() => {
        // Clear the announcement
        announcementContainer.innerText = "";
      });
    }
  }

  /**
   *
   * @param {MouseEvent} evt
   */
  selectOption(evt, selectedItemIndex, selectedItemName) {
    const index = evt
      ? evt.currentTarget.getAttribute("data-index")
      : selectedItemIndex;

    if (index !== "last-item") {
      this._value = evt ? evt.target.innerText : selectedItemName;
      this.newValue = this._value;
    }

    this.input.value = this._value;

    pubsub.fire(this.name, "valuechange", {
      name: this.name,
      value: this._value
    });

    this.dispatchEvent(
      new CustomEvent("change", {
        bubbles: true,
        composed: true,
        detail: this.internaldata[index] || { index: index }
      })
    );

    this.dispatchEvent(
      new CustomEvent("select", {
        bubbles: true,
        composed: true,
        detail: this.internaldata[index] || { index: index }
      })
    );

    this.showLookup(false);
  }

  /**
   * Hides the last item element when no content is passed into the `lastItem` slot.
   * @param {Event} evt
   * @scope private
   */
  lastItemChange(evt) {
    if (evt && evt.target) {
      if (evt.target.assignedElements().length > 0) {
        this.hasLastItemSlot = true;
        this.lastItemClass = `${this.theme}-item${
          this.disableLastItem ? " cmp-pointer-disabled" : ""
        }`;
      } else {
        this.lastItemClass = `${this.theme}-hide`;
      }
    }
  }

  searchOptions = debounce(() => {
    if (typeof this.options === "string") {
      this.options = JSON.parse(this.options);
    }

    this.filterOptions();
  }, 200);

  filterOptions() {
    if (!this.options) {
      return;
    }
    this.internaldata = this.options.filter((item) => {
      if (this.disableFilter) return true;

      if (this._value) {
        return (
          item.name.toLowerCase().includes(String(this._value).toLowerCase()) ||
          (item.displayName &&
            item.displayName
              .toLowerCase()
              .includes(String(this._value).toLowerCase())) ||
          (item.description &&
            item.description
              .toLowerCase()
              .includes(String(this._value).toLowerCase()))
        );
      } else if (this._value === item.name) {
        return false;
      }
      return true;
    });
    this.lazyloadItems();
    this.showLookup(this._isFocused && this._options.length > 0);
  }

  /**
   * Keeps the `_value` up to date with the value of the input.
   * @param {KeyboardEvent} event
   */
  updateValue(event) {
    if (this.remoteSource && this._value !== event.target.value)
      this.progressStart();

    this._value = event.target.value ? event.target.value : "";
    if (this._value === "") {
      this.dispatchEvent(
        new CustomEvent("clear", {
          bubbles: true,
          composed: true
        })
      );
    }
    this.activeDescendant = null;
    this.setItemSelected(-1);
    if (this.hasLastItemSlot) {
      this.setLastItemSelected(false);
    }
  }

  get getKey() {
    return Date.now() + "-" + Math.random();
  }

  @api
  checkValidity() {
    const validity = this.validity;

    //#region custom validators
    // Since min/max validators only run when
    // triggered by user input, handle this through custom.
    if (this._value && this._value.length < this.minLength) {
      this.setCustomValidity(this.messageWhenTooShort);
    } else if (this._value.length > this.maxLength) {
      this.setCustomValidity(this.messageWhenTooLong);
    } else if (
      this.input.validationMessage === this.messageWhenTooLong ||
      this.input.validationMessage === this.messageWhenTooShort
    ) {
      this.setCustomValidity("");
    }
    //#endregion custom validators

    switch (true) {
      case validity.valid:
        this.errorMessage = "";
        break;
      case validity.valueMissing:
        this.errorMessage = this.messageWhenValueMissing;
        break;
      default:
        this.errorMessage = this.input.validationMessage;
    }

    return this.validity.valid;
  }

  @api
  reportValidity() {
    this.isError = !this.checkValidity();

    return this.validity.valid;
  }

  @api
  setCustomValidity(message) {
    this.input.setCustomValidity(message);
  }

  @api
  resetValidations() {
    this.isError = false;
    this.input.setCustomValidity("");
  }

  @api
  focus() {
    this.input.focus();
  }

  lazyloadItems() {
    //To be used for overriding
  }

  /**
   * @deprecated this method is redundant. consumers should just call reportValidity()
   */
  @api
  showHelpMessageIfInvalid() {
    this.reportValidity();
  }

  //#region  private methods
  /**
   * Sets progress bar visibility, and starts progress.
   * @scope api (public)
   */
  @api progressStart() {
    if (this._progressBar) {
      this.showProgress = ``;
      delay(100).then(() => {
        this._progressBar.setProgress(80, 6);
      });
    }
  }

  /**
   * Sets progress-bar's progress to 100%
   * @scope private
   */
  progressComplete() {
    if (this._progressBar) {
      this._progressBar.setProgress(100, 0.5);
      delay(500).then(() => this.progressReset());
    }
  }

  /**
   * Hides the progress bar and resets progress.
   * @scope private
   */
  progressReset() {
    if (this._progressBar) {
      this.showProgress = `${this.theme}-hide`;
      this._progressBar.setProgress(0, 0);
    }
  }
  //#endregion private methods
  get getDropdownClasses() {
    let dropdownClass = `${this.theme}-dropdown ${
      this.theme
    }-dropdown_length-with-icon-7 ${
      this.dropdownDirection
        ? `${this.theme}-dropdown_${this.dropdownDirection} `
        : ""
    } ${this.theme}-dropdown_fluid`;
    if (this.theme === "nds") {
      dropdownClass += " nds-p-bottom_none";
    }
    if (
      this.resetDropdownwidth === "true" ||
      this.resetDropdownwidth === true
    ) {
      dropdownClass += " vloc-reset-minwidth";
    }
    return dropdownClass;
  }
  handleScrollClick(event) {
    if (
      event &&
      event.currentTarget &&
      event.currentTarget.className &&
      event.currentTarget.className.indexOf(`${this.theme}-dropdown`) === 0
    ) {
      event.preventDefault();
    }
  }

  handleKeydown(event) {
    this.activeDescendant = null;
    this._lastKeydownKey = event.key;

    if (event.key === "Escape" || event.key === "Esc") {
      //Close the menu when Esc key is pressed
      this.showLookup(false);
    } else {
      const selectedItemIndex = this.internaldata.findIndex((item) => {
        return item.itemClass
          ? item.itemClass.includes(`${this.theme}-has-focus`)
          : false;
      });
      if (
        event.key === "ArrowUp" ||
        event.key === "Up" ||
        event.key === "ArrowDown" ||
        event.key === "Down"
      ) {
        if (this.internaldata.length > 0) {
          let newIndex = 0;
          if (selectedItemIndex === -1) {
            if (event.key === "ArrowUp" || event.key === "Up") {
              if (this.hasLastItemSlot) {
                if (!this.isLastItemSelected()) {
                  this.setLastItemSelected(true);
                } else {
                  this.setItemSelected(this.internaldata.length - 1);
                }
              } else {
                this.setItemSelected(this.internaldata.length - 1);
              }
            } else if (event.key === "ArrowDown" || event.key === "Down") {
              this.setItemSelected(newIndex);
            }
          } else {
            if (event.key === "ArrowUp" || event.key === "Up") {
              newIndex =
                (selectedItemIndex - 1 + this.internaldata.length) %
                this.internaldata.length;
              if (newIndex === this.internaldata.length - 1) {
                this.handleItemSelection(newIndex);
              } else {
                this.setItemSelected(newIndex);
              }
            }
            if (event.key === "ArrowDown" || event.key === "Down") {
              newIndex = (selectedItemIndex + 1) % this.internaldata.length;
              if (newIndex === 0) {
                this.handleItemSelection(newIndex);
              } else {
                this.setItemSelected(newIndex);
              }
            }
          }
        } else {
          if (this.hasLastItemSlot) {
            if (!this.isLastItemSelected()) {
              this.setLastItemSelected(true);
            }
          }
        }
      } else if (event.key === "Enter") {
        event.preventDefault();
        if (selectedItemIndex !== -1 && this.internaldata.length > 0) {
          const selectedItemName = this.internaldata[selectedItemIndex].name;
          this.selectOption(null, selectedItemIndex, selectedItemName);
        } else {
          if (this.hasLastItemSlot && this.isLastItemSelected()) {
            this.selectOption(null, "last-item", null);
          }
        }
      }
    }
  }

  handleItemSelection(newIndex) {
    if (this.hasLastItemSlot) {
      this.setLastItemSelected(true);
    } else {
      this.setItemSelected(newIndex);
    }
  }

  setItemSelected(currentIndex) {
    this.internaldata = this.internaldata.map((item, index) => {
      if (index === currentIndex) {
        item.itemClass = `${this.theme}-item ${this.theme}-listbox__option ${this.theme}-has-focus`;
        item.selected = true;
        this.activeDescendant = item.itrKey;

        if (this._lastKeydownKey) {
          if (!this._listboxNode) {
            this._listboxNode = this.template.querySelector('[role="listbox"]');
          }

          const itrQueriedComponent = this.template.querySelector(
            `[data-itrkey="${item.itrKey}"]`
          );

          if (itrQueriedComponent) {
            const nextItem = itrQueriedComponent.nextElementSibling;

            listboxScrollUpDown(
              this._listboxNode,
              nextItem,
              this._lastKeydownKey
            );
          }
        }
      } else {
        item.itemClass = `${this.theme}-item`;
        item.selected = null;
      }
      return item;
    });
    if (currentIndex !== -1 && this.hasLastItemSlot) {
      this.setLastItemSelected(false);
    }
  }

  isLastItemSelected() {
    return this.lastItemClass.includes(`${this.theme}-has-focus`);
  }

  setLastItemSelected(set) {
    if (set) {
      this.lastItemClass = `${this.theme}-item ${this.theme}-listbox__option ${this.theme}-has-focus`;
      this.setItemSelected(-1);
    } else {
      this.lastItemClass = `${this.theme}-item`;
    }
  }
}
