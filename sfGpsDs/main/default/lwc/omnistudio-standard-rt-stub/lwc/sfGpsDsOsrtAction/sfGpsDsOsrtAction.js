import { LightningElement, api, track, wire } from "lwc";
import {
  namespace,
  getDataHandler,
  isCommunityPage,
  params,
  interpolateElement,
  lwcPropertyNameConversion,
  fetchCustomLabels,
  localStoreMethods,
  getUserProfile
} from "c/sfGpsDsOsrtUtility";
import { delay } from "c/sfGpsDsOsrtAsyncUtils";
import {
  fetchProperties,
  fireVlocityAction,
  getSORecord,
  setExtraParams,
  interpolateAction,
  interpolateContextId,
  validObj,
  setVlocityAction,
  setCustomAction,
  setOsAction,
  setEventAction,
  fetchActionEvtObject,
  performOsAction,
  fireCustomAction,
  interpolateValue
} from "./actionHelper";
import pubsub from "c/sfGpsDsOsrtPubsub";
import { isEqual, get } from "c/sfGpsDsOsrtLodash";
import sldsTemplate from "./action_slds.html";
import ndsTemplate from "./action_nds.html";
import { getDefaultTrackingData, initInteraction } from "c/sfGpsDsOsrtActionUtility";
import vtag from "c/sfGpsDsOsrtOaVtag";
import { isSalesforcePlatform } from "c/sfGpsDsOsrtSdkUtility";
import { BaseFlexElementMixin } from "c/sfGpsDsOsrtBaseFlexElementMixin";
import { CurrentPageReference } from "lightning/navigation";
export default class Action extends BaseFlexElementMixin(LightningElement) {
  /** url
   * @type {String}
   */
  @api url;
  /**
   * theme - To add a UI theme slds/nds
   * @type {String}
   */
  @api theme = "slds";
  /**
   * iconUrl - To add a base url for action icon
   * @type {String}
   */
  @api iconUrl;
  /**
   * iconOnly - To display only icon in UI
   * @type {String}
   */
  @api iconOnly = false;
  /**
   * extraClass - To add extraClass for action div
   * @type {String} */
  @api extraClass = "";
  /**
   * iconSize - To add a iconSize for action icon
   * @type {String} */
  @api iconSize;
  /**
   * iconExtraclass - To add extraClass for action icon
   * @type {String} */
  @api iconExtraclass = "";
  /**
   * actionDisplay
   * @type {String} */
  @api actionDisplay;
  /**
   * iconWrapperclass - To add a wrapper class for action icon
   * @type {String} */
  @api iconWrapperclass = "";
  /**
   * actionLabelclass - To add a class for action label
   * @type {String} */
  @api actionLabelclass = "";
  /**
   * actionWrapperclass - To add a wrapper class for action container
   * @type {String} */
  @api actionWrapperclass = "";
  /**
   * iconImgWrapperclass - To add a wrapper class for action icon image
   * @type {String} */
  @api iconImgWrapperclass = "";
  /**
   * hideActionIcon - To hide icon from the UI
   * @type {String}*/
  @api hideActionIcon = false;
  /**
   * displayAsButton - To display the UI as button
   * @type {String} */
  @api displayAsButton = false;
  /**
   * buttonVariant - To add a variant for action button
   * @type {String} */
  @api buttonVariant;
  /**
   * isTrackingDisabled - To disable tracking
   * @type {boolean} */
  @api isTrackingDisabled = false;
  /**
   * trackingObj
   * @type {Object} */
  @api trackingObj;
  /**
   * reRenderFlyout - To Re render the flyout on toggle
   * @type {boolean} */
  @api reRenderFlyout;
  /**
   * disableCache - If true do not cache the actions in session storage
   * @type {boolean} */
  @api disableCache = false;

  /**
   * definition - Action Definition
   * @memberof Action
   */
  @api get definition() {
    return this._definitionObj ? JSON.stringify(this._definitionObj) : "{}";
  }
  set definition(val) {
    this.isDefinition = true;
    this._definitionObj = typeof val === "string" ? JSON.parse(val) : val;
  }

  /**
   * preloadFlyout - To load the flyout on load of action
   * @memberof Action
   */
  @api get preloadFlyout() {
    return this._preloadFlyout;
  }
  set preloadFlyout(val) {
    if (val === "true" || val === true) {
      this._preloadFlyout = true;
    }
  }

  /**
   * iconColor - To set icon color
   * @memberof Action
   */
  @api get iconColor() {
    return this._iconColor || "#05a6df";
  }
  set iconColor(val) {
    this._iconColor = val;
  }

  /**
   * sObjectType - Used to perform action based on the sObject type
   * @memberof Action
   */
  @api get sObjectType() {
    return this._sObjectType;
  }
  set sObjectType(val) {
    this.unInterpolatedFields.sObjectType = val;
    this._rawFieldValues.sObjectType = val;
    this._sObjectType = interpolateValue(val);
    this.oldInterpolatedFields.sObjectType = this._sObjectType;
    this.setProperty("sObjectType");
  }

  /**
   * contextId - Used to perform action based on the contextId
   * @memberof Action
   */
  @api get contextId() {
    return this._contextId;
  }
  set contextId(val) {
    this._rawFieldValues.contextId = val;
    if (typeof val === "string" && val.charAt(0) === "\\") {
      val = val.substring(1);
    }
    this.unInterpolatedFields.contextId = val;
    this._contextId = interpolateContextId(val);
    this.oldInterpolatedFields.contextId = this._contextId;
    this.setProperty("contextId");
  }

  /**
   * stateObj - Used to perform action based on the record object
   * @memberof Action
   */
  @api
  get stateObj() {
    return this._stateObj;
  }
  set stateObj(val) {
    this._stateObj = val;
    this.setProperty("stateObj");
    this.triggerRender();
  }

  /**
   * stateAction - It contains the required action details
   * @memberof Action
   */
  @api
  get stateAction() {
    return this._stateAction;
  }
  set stateAction(val) {
    this._rawFieldValues.stateAction = val;
    val = val ? (typeof val === "string" ? validObj(val) : val) : {};
    if (val && val.id) {
      this._stateAction = val;
      this.isVlocityAction = true;
      this.initData();
    }
  }
  /**
   * debug - To display the debug panel
   * @memberof Action
   */
  @api get debug() {
    return this._debug;
  }
  set debug(value) {
    this._debug = value === "true" || value === true ? true : false;
  }

  /**
   * styles - To inline styles inside the action continer
   * @memberof Action
   */
  @api get styles() {
    return this._styles;
  }
  set styles(val) {
    val = val ? (typeof val === "string" ? validObj(val) : val) : {};
    this._styles = val;
    this.applyStyles(val);
  }

  @api menuItemData;

  /**
   * All Track Variables
   */

  @track _iconColor;
  @track _stateObj;
  @track _debug = false;
  @track timeTaken;
  @track error;
  @track errormessage;
  @track isOpen = true;
  @track _definitionObj;
  @track target;
  @track isVlocityAction = false;
  @track allActions;
  @track actionDetails;
  @track isBaseVersion = false;
  @track _stateAction;
  @track isDefinition = false;
  @track isFlyout = false;
  @track isPopoverFlyout = false;
  @track _oaObj = {};
  @track labelStyle;
  @track textAlign;
  @track renderFlyout = true;
  @track selectableAction = false;
  @track _preloadFlyout;
  @track isModalFlyout = false;

  /**
   * All Private Variables
   */

  isModalFlyoutOpen = false;
  isMultipleAction = false;
  unInterpolatedFields = {};
  oldInterpolatedFields = {};
  isFlyoutOpen = false;
  isPageRefSet = false;
  actionUrl;
  nsPrefix = "";
  startTime;
  endTime;
  _styles = {};
  actionCreated = false;
  _regexPattern = /\{([a-zA-Z.0-9_]+)\}/g;
  _rawFieldValues = {};
  properties = {};

  _currentpageRef;
  @wire(CurrentPageReference)
  getPageReferenceParameters(currentPageReference) {
    this._currentpageRef = currentPageReference;
  }
  /**
   * Method to return a HTML template
   * @return {template}
   * @memberof Action
   */
  render() {
    if (this.theme === "nds") {
      return ndsTemplate;
    }
    return sldsTemplate;
  }

  /**
   * Method to rerender the template on setValue action
   * @memberof Action
   */
  triggerRender() {
    this.setProperty("_allMergeFields");
    Object.keys(this._rawFieldValues).forEach((key) => {
      this[key] = this._rawFieldValues[key];
    });
    if (this.actionCreated && !this.preventInitMethod) {
      this.isRecordUpdated = false;
      this.interpolatedAction = interpolateAction(this.stateAction);
      this.validateInterpolatedAction(true);
      if (this.isRecordUpdated) {
        this.dataInterpolated = true;
        this.isRecordUpdated = false;
        this.initData();
        this.dataInterpolated = false;
      }
    }
    if (this.card) {
      this.cardsListLabel = this.card.selectedCardsLabel;
    }
  }

  /**
   * Method to process the data onload
   * @memberof Action
   */
  initData() {
    if (!this.isActionRendered) {
      this.isActionRendered = true;
      isCommunityPage().then((result) => {
        this.isCommunity = result;
        this.setProperty("isCommunity");
      });
      this.nsPrefix = namespace;
    }
    if (!this.preventInitMethod) {
      this.resolveActionDetails().then(() => {
        this.saveCommonProperties();
        const elem = this.querySelectorAll("*")[0];
        this.isBaseVersion = !elem || (elem && elem.slot === "flyout");
      });
    }
  }

  /**
   * Method to apply inline styles
   * @memberof Action
   */
  applyStyles(val) {
    this.labelStyle = "";
    this.textAlign = "";
    if (val && val.label) {
      let keys = Object.keys(val.label);
      keys.forEach((key) => {
        if (val.label[key]) {
          if (key !== "textAlign") {
            this.labelStyle += `${lwcPropertyNameConversion(key)}:${
              val.label[key]
            };`;
          } else {
            this.textAlign = `${this.theme}-text-align--${val.label[key]}`;
          }
        }
      });
    }
  }

  /**
   * Method to save common properties in actionUtils
   * @memberof Action
   */
  saveCommonProperties() {
    let obj = {
      actionDetails: { ...this.actionDetails },
      contextId: this.contextId,
      stateObj: this.stateObj,
      sObjectType: this.sObjectType,
      actionUrl: this.actionUrl,
      isCommunity: this.isCommunity,
      param: this.param ? { ...this.param } : {},
      userProfile: this.userProfile ? { ...this.userProfile } : {}
    };
    this.setVariables(obj);
  }

  /**
   *  @param {String} key Object key
   * Method to set property in actionUtils
   * @memberof Action
   */
  setProperty(key) {
    if (key && this[key]) {
      this.properties[key] = this[key];
    }
    fetchProperties(this.properties);
  }

  /**
   * To set action variables
   * @param {*} obj To initialize variables
   */
  setVariables(obj) {
    for (let key in obj) {
      if (obj[key]) {
        this.properties[key] = obj[key];
      }
    }
    fetchProperties(this.properties);
  }

  /**
   * @param {Boolean} setValue this flag will be true if this method is called after setValue action
   * Method to check whether the action data is updated after setValue action
   * @memberof Action
   */
  validateInterpolatedAction(setValue) {
    if (setValue) {
      if (this.unInterpolatedFields.contextId)
        this._contextId = interpolateContextId(
          this.unInterpolatedFields.contextId
        );
      if (this.unInterpolatedFields.sObjectType)
        this._sObjectType = interpolateValue(
          this.unInterpolatedFields.sObjectType
        );
      this.isRecordUpdated =
        !isEqual(this.interpolatedAction, this.oldInterpolatedFields.action) ||
        (this.contextId &&
          this.contextId !== this.oldInterpolatedFields.contextId) ||
        (this.sObjectType &&
          this.sObjectType !== this.oldInterpolatedFields.sObjectType);
    } else {
      this.oldInterpolatedFields.action = {
        ...this.interpolatedAction
      };
    }
  }

  /**
   * @param {String} key Action type name
   * @param {String} obj Data that needs to be populated in action debugger
   * Method to fire event for action debugger
   * @memberof Action
   */
  fireActionDebugEvent(key, obj) {
    if (!this.isPreview) return;
    fetchActionEvtObject(key, obj).then((response) => {
      this.fireCustomEvent("actionclick", response);
    });
  }

  /**
   * Method to intrepolate action properties
   * @memberof Action
   */
  interpolateProperties() {
    if (!this.dataInterpolated) {
      this.interpolatedAction = interpolateAction(this.stateAction);
    }
    if (this.contextId && typeof this.contextId === "string") {
      this.contextId = interpolateContextId(this.contextId);
    }
    this.validateInterpolatedAction();
    this.isFlyout = false;
  }

  async getUserprofileData() {
    let userProfile;

    if (!localStoreMethods.getItem("userProfile")) {
      userProfile = await getUserProfile();
      localStoreMethods.setItem("userProfile", JSON.stringify(userProfile));
    } else {
      userProfile = JSON.parse(localStoreMethods.getItem("userProfile"));
    }

    return userProfile;
  }

  /**
   * Method to resolve action data onload
   * @memberof Action
   */
  async resolveActionDetails() {
    fetchProperties(this.properties);
    this.interpolateProperties();

    let action = this.interpolatedAction;
    this.param = params(this._currentpageRef);
    this.param.id = this.param.id || action.recordId;
    this.userProfile = await this.getUserprofileData();

    return this.configAction(action);
  }

  /**
   * @param {Object} action Action Details
   * Method to update action data based on type
   * @memberof Action
   */
  async configAction(action) {
    fetchProperties(this.properties);
    let type = action.type;
    let response;
    let url;
    try {
      switch (type) {
        case "Vlocity Action":
          response = await setVlocityAction(action, this.disableCache);
          //If vlocity action has custom label then use that coming from action properties, if not, use action display Label
          response.displayName = await this.fetchActionDisplayLabel(
            response,
            response[namespace + "CustomLabelName__c"]
          );
          url = response[this.nsPrefix + "Url__c"];
          this.actionUrl = url ? url : "";
          this.saveActionData(response);
          this.actionDetails.type = "Vlocity Action";
          break;
        case "OmniScript":
          response = setOsAction(action);
          this.saveActionData(response);
          break;
        case "Event":
          response = setEventAction(action);
          this.saveActionData(response);
          break;
        case "updateOmniScript":
          response = setEventAction(action);
          this.saveActionData(response);
          break;
        case "cardAction":
          response = setEventAction(action);
          this.saveActionData(response);
          if (action.eventName === "selectcards") {
            this.selectableAction = true;
          }
          break;
        case "DataAction":
          response = setEventAction(action);
          this.saveActionData(response);
          break;
        case "PubSub":
          response = setEventAction(action);
          this.saveActionData(response);
          break;
        case "Flyout":
          response = this.setFlyoutAction(action);
          this.saveActionData(response);
          break;
        case "Custom":
          response = setCustomAction(action);
          if (response) {
            this.saveActionData(response.action);
            this.actionUrl = response.actionUrl;
            if (response.isPageRefSet) {
              this.isPageRefSet = response.isPageRefSet;
            }
          }
          break;
        default:
          console.error("Invalid action type:" + type);
          return Promise.reject("Invalid action type");
      }
      return response;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async fetchActionDisplayLabel(actionDetails, label) {
    try {
      if (this.stateAction?.displayName && this.card) {
        if (
          actionDetails.displayName &&
          actionDetails.displayName.charAt(0) === "{"
        ) {
          return get(
            this.card,
            this.stateAction.displayName.replace(
              /[{}]/g,
              actionDetails.displayName
            )
          );
        }
      } else if (label) {
        let labels = await fetchCustomLabels([label]);
        return labels[label];
      }
      return actionDetails.displayName;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  /**
   * @param {Object} action Updated action object
   * Method to save action after update
   * @memberof Action
   */
  saveActionData(action) {
    this.actionDetails = action ? { ...action } : {};
    this.actionCreated = true;
  }

  /**
   *
   * Method to fire Custom Event
   * @param {String} eventName
   * @param {Object} data
   */
  fireCustomEvent(eventName, data) {
    let event = new CustomEvent(eventName, {
      bubbles: true,
      composed: true,
      detail: data || ""
    });
    this.dispatchEvent(event);
  }

  /**
   *
   * Method to fire a custom event
   * @param {String} eventName
   * @param {Object} data
   */
  fireEvent(eventName, data) {
    let event = new CustomEvent(eventName, {
      bubbles: true,
      composed: true,
      detail: {
        result: data
      }
    });
    this.dispatchEvent(event);
  }

  /**
   *
   * Method to perform select cards action
   * @param {T} event Event from where it is triggered
   */
  fireSelectCard(event) {
    let detail = {
      value: event.currentTarget.checked
    };
    const selectCardEvent = new CustomEvent("selectcards", {
      bubbles: true,
      composed: true,
      detail: detail
    });
    this.dispatchEvent(selectCardEvent);
    let listName = this.cardsListLabel ? this.cardsListLabel : "selectedcards";
    this.fireEvent(`selectcards_${listName}`);
  }

  triggerSelectCard() {
    let detail = {
      value: null,
      actionType: "cardAction",
      subType: "selectcards"
    };
    Promise.resolve().then(() => {
      let listName = this.cardsListLabel
        ? this.cardsListLabel
        : "selectedcards";
      this.fireEvent(`selectcards_${listName}`);
    });
    return detail;
  }

  /**
   *
   * Method to set flyout action details
   * @param {Object} action
   */
  setFlyoutAction(action) {
    this.isFlyout =
      action.parent !== "menu" || action?.isMenuItem || this.menuItemData;
    let clonedAction = {
      ...action,
      iconName:
        action.vlocityIcon && !/^icon-/.test(action.vlocityIcon)
          ? action.vlocityIcon.replace("-", ":")
          : action.vlocityIcon
            ? "utility:forward_up"
            : ""
    };
    this.isPopoverFlyout =
      clonedAction.openFlyoutIn === "Popover" ? true : false;
    clonedAction.hasIcon = clonedAction.iconName ? true : false;
    this.isModalFlyout = clonedAction.openFlyoutIn === "Modal" ? true : false;
    this.channelName = clonedAction.channelName;
    return clonedAction;
  }

  resetVariables() {
    this.preventInitMethod = true;
    this.isPageRefSet = false;
    this.selectableAction = false;
    this.actionUrl = "";
    this.properties = {};
  }

  /**
   * This method can be used to close the opened modal from outside action component
   */
  @api closeFlyout() {
    if (this.isModalFlyoutOpen) {
      const modal = this.template.querySelector(".actionFlyout");
      if (modal) {
        modal.closeModal();
      }
    }
  }

  /**
   * This method can be used to trigger action from outside action component
   * @param {T} event Event from where it is triggered
   * @param {*} card card object
   */
  @api async executeAction(event, card, isMultipleAction, eventSource) {
    try {
      this.isMultipleAction = isMultipleAction;
      this.resetVariables();
      let currentTarget = event.currentTarget;
      this.stateObj =
        typeof currentTarget.record === "string"
          ? JSON.parse(currentTarget.record)
          : currentTarget.record;
      this.card = card;
      let actionData =
        typeof currentTarget.action === "string"
          ? JSON.parse(currentTarget.action).actionData
          : currentTarget.action.actionData;
      this.stateAction =
        actionData && actionData.stateAction ? actionData.stateAction : {};
      if (actionData) {
        this.sObjectType = actionData.sObjectType;
        this.contextId = actionData.contextId;
        this.isTrackingDisabled =
          actionData.isTrackingDisabled === true ||
          actionData.isTrackingDisabled === "true"
            ? true
            : false;
      }
      if (eventSource === "EventTrigger") {
        let targetElement = isMultipleAction ? event.target : currentTarget;
        if (targetElement) {
          this.stateAction = interpolateElement(
            this.stateAction,
            targetElement
          );
        }
      }
      if (currentTarget.action) {
        event.targetVal = currentTarget.checked
          ? currentTarget.checked
          : currentTarget.value
            ? currentTarget.value
            : "";
        event.action = currentTarget.action;
      }
      this.preventInitMethod = false;
      await this.resolveActionDetails();
      this.saveCommonProperties();
      if (
        this.actionDetails &&
        this.actionDetails.type === "cardAction" &&
        this.actionDetails.eventName === "selectcards"
      ) {
        const result = this.triggerSelectCard(event);
        return result;
      }
      const result = await this.performAction(event);
      return result;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  /**
   *
   * Method to fire event action
   */
  fireEventAction() {
    let customParam = setExtraParams(this.actionDetails.extraParams, true);
    let type = this.actionDetails.type;
    let subType = this.actionDetails.subType;
    let evtType =
      type === "PubSub" || subType === "PubSub"
        ? "PubSub"
        : subType === "Custom"
          ? "Custom"
          : "";
    this.fireActionDebugEvent(evtType, customParam);
    this.setOaObj();
    if (evtType) {
      if (evtType === "PubSub") {
        pubsub.fire(
          this.actionDetails.eventName,
          this.actionDetails.message,
          customParam
        );
      } else {
        let bubbles = this.actionDetails.bubbles;
        let composed = this.actionDetails.composed;
        let event = new CustomEvent(this.actionDetails.eventName, {
          bubbles: bubbles === undefined ? false : bubbles,
          composed: composed === undefined ? false : composed,
          detail: customParam || ""
        });
        this.dispatchEvent(event);
      }
    }
  }

  /**
   *
   * Method to perform card action
   * @param {T} event Event from where it is triggered
   */
  fireCardAction(event) {
    return new Promise((resolve) => {
      let evtName = this.actionDetails.eventName;
      let eventType = evtName;
      let label = this.actionDetails.displayName;
      let data = this.actionDetails.message;
      let obj = { displayName: label };
      let val = event.targetVal === "true" || event.targetVal === true;
      let detail;
      let node, ignoreResponse;
      if (this.actionDetails.type === "DataAction") {
        eventType = "Data Action";
        evtName = "fireactionevent";
        ignoreResponse =
          this.actionDetails.ignoreResponse === true ||
          this.actionDetails.ignoreResponse === "true";
        node = this.actionDetails.responseNode;
      }
      switch (eventType) {
        case "setValues":
          if (!this.isMultipleAction) {
            this.fireCustomEvent("setvalue", this.actionDetails);
            resolve(this.actionDetails);
          } else {
            obj = {
              actionDetails: this.actionDetails,
              actionType: "cardAction",
              subType: "setValues"
            };
            resolve(obj);
          }
          break;
        case "updatedatasource":
          detail = { message: data, ...obj };
          break;
        case "Data Action":
          detail = {
            type: eventType,
            message: data,
            ...obj,
            responseNode: node,
            ignoreResponse: ignoreResponse
          };
          break;
        case "selectcards":
          detail = { value: val, ...obj };
          break;
        case "appendRecord":
          detail = {
            appendToRecords: this.actionDetails.appendToRecords,
            key: this.actionDetails.appendRecordKey,
            value: this.actionDetails.valueToAppend,
            ...obj
          };
          break;
        default:
          detail = obj;
          break;
      }
      if (detail) {
        let customEvt = new CustomEvent(evtName, {
          bubbles: true,
          composed: true,
          detail: detail
        });
        if (event.action) {
          customEvt.action = event.action;
        }
        if (this.isMultipleAction) {
          let actionDetail = {
            detail: detail,
            action: event.action,
            actionType: this.actionDetails.type,
            subType: eventType
          };
          resolve(actionDetail);
        } else {
          this.dispatchEvent(customEvt);
          resolve(detail);
        }
      }
    });
  }

  /**
   *
   * Method to perform OS action
   */
  fireUpdateOSaction() {
    return new Promise((resolve) => {
      let customParam = setExtraParams(this.actionDetails.extraParams, true);
      const eventName = "updateos";
      let elemId = this.actionDetails.elementId;
      const detail = {
        data: customParam,
        elementId: elemId || ""
      };
      this.setOaObj();
      this.fireActionDebugEvent("updateOmniScript", customParam);
      if (this.isMultipleAction) {
        let actionDetail = {
          detail: detail,
          actionType: this.actionDetails.type,
          subType: this.actionDetails.type
        };
        resolve(actionDetail);
      } else {
        this.fireCustomEvent(eventName, detail);
        resolve(detail);
      }
    });
  }
  /**
   *
   * Method to perform navigate action
   * @param {Object} response Action object
   */
  fireNavAction(response) {
    if (response && response.data) {
      this.actionDetails = { ...response.data };
      this.setProperty("actionDetails");
    }
    this.setOaObj();
    return this.triggerNavigate();
  }
  /**
   *
   * Method to perform flyout action
   * @param {T} event Event from where it is triggered
   */
  fireFlyoutAction(event) {
    if (this.isFlyout) {
      this.toggleFlyout(event);
    }
    this.setOaObj();
    this.fireActionDebugEvent("Flyout");
  }
  /**
   *
   * Method to perform OS action
   */
  fireOsAction(response) {
    if (response) {
      if (response.data) {
        this.actionDetails = { ...response.data };
        this.setProperty("actionDetails");
      }
      this.fireActionDebugEvent(
        "OmniScript",
        response.details ? { ...response.details } : {}
      );
    }
    this.setOaObj();
    return this.triggerNavigate();
  }
  /**
   *
   * This method get executed on click of action
   * @param {T} event Event from where it is triggered
   */
  async performAction(event) {
    let result;
    let response;
    fetchProperties(this.properties);
    try {
      this._oaObj.ActionClickTime = Date.now();
      let type = this.actionDetails.type;
      switch (type) {
        case "Vlocity Action":
          if (!this.isPageRefSet) {
            response = await fireVlocityAction();
            result = await this.fireNavAction(response);
          } else {
            result = await this.fireNavAction();
          }
          break;
        case "Custom":
          if (!this.isPageRefSet) {
            response = await fireCustomAction();
            result = await this.fireNavAction(response);
          } else {
            result = await this.fireNavAction();
          }
          break;
        case "Event":
          this.fireEventAction();
          result = "Event Fired";
          break;
        case "PubSub":
          this.fireEventAction();
          result = "Event Fired";
          break;
        case "cardAction":
          result = await this.fireCardAction(event);
          this.setOaObj();
          break;
        case "DataAction":
          result = await this.fireCardAction(event);
          this.setOaObj();
          break;
        case "Flyout":
          this.fireFlyoutAction(event);
          result = "Flyout Toggled";
          break;
        case "updateOmniScript":
          result = await this.fireUpdateOSaction();
          break;
        case "OmniScript":
          response = await performOsAction();
          result = await this.fireOsAction(response);
          break;
        default:
          break;
      }
      return result;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  /**
   *
   * This method is used to toggle flyout
   * @param {T} e Event from where it is triggered
   */
  toggleFlyout(e) {
    if (this.isPopoverFlyout) {
      if (!this.isFlyoutOpen) {
        this.setRenderFlyout(true);
        this.template.querySelector(".popover-flyout").openPopover(e);
      } else {
        this.setRenderFlyout(false);
        this.template.querySelector(".popover-flyout").closePopover(e);
      }
      if (!this._eventFired) {
        this._eventFired = delay(100).then(() => {
          this.isFlyoutOpen = !this.isFlyoutOpen;
          this._eventFired = null;
        });
      }
    } else if (this.isModalFlyout) {
      this.setRenderFlyout(true);
      this.isModalFlyoutOpen = true;
      this.template.querySelector(".actionFlyout").openModal();
    }
  }

  /**
   *
   * This method gets triggered on close of flyout modal
   */
  onCloseModal() {
    this.isModalFlyoutOpen = false;
    this.setRenderFlyout(false);
    Promise.resolve().then(() => {
      let focusElement = this.template.querySelector(`[data-action-focus]`);
      if (focusElement) {
        focusElement.focus();
      }
    });
    if (this.actionDetails?.isMenuItem || this.menuItemData) {
      this.dispatchEvent(
        new CustomEvent("closemenumodal", {
          detail: {},
          bubbles: true
        })
      );
    }
  }

  onOpenModal() {
    this.isModalFlyoutOpen = true;
    if (this.actionDetails?.isMenuItem || this.menuItemData) {
      this.dispatchEvent(
        new CustomEvent("openmenumodal", {
          detail: {},
          bubbles: true
        })
      );
    }
  }

  /**
   *
   * This method is used to set renderFlyout flag
   * @param {Boolean} flag
   */
  setRenderFlyout(flag) {
    if (flag) {
      this._preloadFlyout = true;
    }
    if (this.reRenderFlyout === "true" || this.reRenderFlyout === true) {
      this.renderFlyout = flag;
    }
  }

  /**
   *
   * This method is used to navigate to a page reference
   */
  triggerNavigate() {
    let navigateAction;
    return Promise.resolve()
      .then(() => {
        navigateAction = this.template.querySelector(".navigate-action");
        if (!navigateAction) {
          return Promise.reject("No navigation action found");
        }
        return navigateAction.generateUrl();
      })
      .then(() => {
        return navigateAction.navigate();
      })
      .then((pageRef) => {
        if (this.actionDetails.type === "Custom") {
          this.fireActionDebugEvent("Navigate Action", pageRef);
        } else if (this.actionDetails.type === "Vlocity Action") {
          this.fireActionDebugEvent("Vlocity Action");
        }
        return pageRef;
      })
      .catch((e) => {
        return Promise.reject(e);
      });
  }

  setOaObj() {
    if (isSalesforcePlatform === false) {
      return;
    }
    if (this.isPreview) return;

    this.isTrackingDisabled =
      this.isTrackingDisabled === true || this.isTrackingDisabled === "true";

    //tracking interaction only if OA tracking is enabled
    if (!this.isTrackingDisabled) {
      this.addTrackingEntry();
    }

    if (
      this.isTrackingDisabled ||
      !(
        this.card &&
        this.card.Id &&
        this.getCardKey() &&
        this.trackingObj &&
        this.trackingObj.parentCardInstanceIdentifier &&
        this.trackingObj.containerId &&
        this.trackingObj.containerGlobalKey &&
        this.trackingObj.containerInstanceIdentifier
      )
    )
      return;

    // Formatting data
    let flyoutType =
      this.actionDetails.flyoutType === "customLwc"
        ? "Custom Lwc"
        : this.actionDetails.flyoutType === "childCard"
          ? "Child Card"
          : this.actionDetails.flyoutType === "omniScript"
            ? "OmniScript"
            : this.actionDetails.flyoutType;

    let flyoutName =
      this.actionDetails.flyoutType === "childCard"
        ? this.actionDetails.cardName
        : this.actionDetails.flyoutLwc;

    let actionEventName =
      this.actionDetails.eventName === "setValues"
        ? "Set Values"
        : this.actionDetails.eventName === "updatedatasource"
          ? "Update Datasource"
          : this.actionDetails.eventName === "reload"
            ? "Reload"
            : this.actionDetails.eventName === "remove"
              ? "Remove"
              : this.actionDetails.eventName;

    let eventName = "UI Action";

    // -- OA keys START
    this._oaObj.ActionContainerComponent = "Card";
    this._oaObj.ActionElementType = "UI Action";
    this._oaObj.TrackingCategory = "UI";
    this._oaObj.RequestUrl = window.location?.href || "";

    this._oaObj.Name = eventName;
    this._oaObj.ComponentId = this.trackingObj.containerId;
    this._oaObj.ActionContainerId = this._oaObj.ComponentId;
    this._oaObj.ActionContainerGlobalKey = this.trackingObj.containerGlobalKey;
    this._oaObj.InstanceIdentifier =
      this.trackingObj.containerInstanceIdentifier;

    this._oaObj.ActionElementName = this.actionDetails.Name
      ? this.actionDetails.Name
      : this.actionDetails.displayName
        ? this.actionDetails.displayName
        : "Action";
    this._oaObj.ActionElementLabel = this.actionDetails.displayName
      ? this.actionDetails.displayName
      : "Action";

    this._oaObj.ActionTargetType =
      this.actionDetails.type === "Custom"
        ? "Navigate"
        : this.actionDetails.type === "cardAction"
          ? "Card"
          : this.actionDetails.type === "updateOmniScript"
            ? "Update OmniScript"
            : this.actionDetails.type;

    this._oaObj.ActionTargetName =
      this._oaObj.ActionTargetType === "OmniScript"
        ? this.actionDetails.omniType.Name
        : this._oaObj.ActionTargetType === "Flyout"
          ? flyoutName
          : this._oaObj.ActionTargetType === "Event"
            ? actionEventName
            : this.actionDetails.targetName;

    if (this.card.tracking) {
      if (this.card.tracking.businessEvent) {
        let businessEvent = interpolateValue(this.card.tracking.businessEvent);
        if (businessEvent) this._oaObj.BusinessEvent = businessEvent;
      }
      if (this.card.tracking.businessCategory) {
        let businessCategory = interpolateValue(
          this.card.tracking.businessCategory
        );
        if (businessCategory) this._oaObj.BusinessCategory = businessCategory;
      }

      if (this.card.tracking.customFields) {
        let customFields = this.card.tracking.customFields;
        customFields.forEach((customField) => {
          let fieldValue = interpolateValue(customField.val);
          if (fieldValue) this._oaObj[customField.name] = fieldValue;
        });
      }
    }
    // --- OA keys END

    // -- Custom/Data__c Fields START
    this._oaObj.CardId = this.card.Id;
    this._oaObj.CardGlobalKey = this.getCardKey();
    this._oaObj.CardInstanceIdentifier =
      this.trackingObj.parentCardInstanceIdentifier;

    let actionTargetSubType =
      this._oaObj.ActionTargetType === "Flyout"
        ? flyoutType
        : this._oaObj.ActionTargetType === "Event"
          ? this.actionDetails.subType
          : this._oaObj.ActionTargetType === "Vlocity Action"
            ? this.sObjectType
            : this._oaObj.ActionTargetType === "Card"
              ? actionEventName
              : this._oaObj.ActionTargetType === "OmniScript"
                ? ""
                : this.actionDetails.targetType;

    if (actionTargetSubType)
      this._oaObj.ActionTargetSubType = actionTargetSubType;

    let targetSubType = this._oaObj.ActionTargetSubType
      ? `/${this._oaObj.ActionTargetSubType}`
      : "";
    this._oaObj.ActionInstanceIdentifier = `${
      this._oaObj.ActionElementName
    }${targetSubType}/${this._oaObj.ActionTargetType}/${Date.now()}${Math.floor(
      Math.random() * 1000
    )}`;

    this._oaObj.ActionOpenMode =
      this.actionDetails.openUrlIn || this.actionDetails.openMode;

    this._oaObj.ActionContextId =
      this.actionDetails.ContextId || this.contextId;
    if (!this._oaObj.ActionContextId) {
      let record = getSORecord();
      this._oaObj.ActionContextId = record && record.Id ? record.Id : "";
    }

    let actionUrl =
      this.actionUrl && this._oaObj.ActionTargetName !== this.actionUrl
        ? this.actionUrl
        : this.actionDetails.targetName &&
            this._oaObj.ActionTargetName !== this.actionDetails.targetName
          ? this.actionDetails.targetName
          : "";
    if (actionUrl) this._oaObj.ActionUrl = actionUrl;

    if (this.actionDetails.Id) this._oaObj.ActionId = this.actionDetails.Id;

    if (this.actionDetails.openFlyoutIn)
      this._oaObj.ActionFlyoutOpenIn = this.actionDetails.openFlyoutIn;

    if (this.actionDetails.subType === "PubSub")
      this._oaObj.ActionTargetPubSubEvent = this.actionDetails.message;

    if (this.actionDetails.flyoutParams || this.actionDetails.fieldValues)
      this._oaObj.ActionFields =
        this.actionDetails.flyoutParams || this.actionDetails.fieldValues;
    // -- Custom/Data__c Fields END

    vtag.track(eventName, this._oaObj);
  }

  addTrackingEntry() {
    //Prevent track field action to be stored
    if (
      this.actionDetails?.subType === "PubSub" &&
      this.actionDetails.eventName?.indexOf("addInteractionTopic:") !== -1
    ) {
      return;
    }
    let record = getSORecord();
    let ctxId = this.contextId ? this.contextId : record ? record.Id : null;
    let interactionData = getDefaultTrackingData();
    let isTimed = false;
    let trackKey = "";
    // eslint-disable-next-line vars-on-top
    var eventData = {};
    eventData.EntityName =
      (this.stateObj && (this.stateObj.Name || this.stateObj.name)) || "";
    eventData.TrackingService = "CardFramework";
    eventData.TrackingEvent = "performAction";
    eventData.Timestamp = new Date().toISOString();
    eventData.ContextId = ctxId;
    eventData.CustomerInteractionId =
      (this.stateObj && this.stateObj.InteractionId) || "";
    eventData.ActionInfo = this.actionDetails;
    eventData.CardElement = this.actionDetails.displayName;
    trackKey = trackKey ? trackKey : Date.now();
    interactionData = { ...interactionData, ...eventData };
    if (eventData.CustomerInteractionId) {
      initInteraction(interactionData, isTimed, trackKey);
    } else if (this._allMergeFields && this._allMergeFields.recordId) {
      pubsub.fire(
        `addInteractionTopic:${this._allMergeFields.recordId}`,
        "trackInteractionAction",
        {
          interactionData: interactionData,
          isTimed: isTimed,
          trackKey: trackKey
        }
      );
    }
  }

  getCardKey() {
    let ckey =
      "OmniUiCardKey" in this.card
        ? this.card.OmniUiCardKey
        : this.nsPrefix + "OmniUiCardKey__c" in this.card
          ? this.card[this.nsPrefix + "OmniUiCardKey__c"]
          : "GlobalKey__c" in this.card
            ? this.card.GlobalKey__c
            : this.nsPrefix + "GlobalKey__c" in this.card
              ? this.card[this.nsPrefix + "GlobalKey__c"]
              : "";
    return ckey;
  }
  /**
   * This method is used to check whether we are in preview page or not
   * @readonly
   * @return {Boolean}
   * @memberof Action
   */
  get isPreview() {
    return (
      this.card?.Params?.isPreview === true || this.param?.isPreview === "true"
    );
  }

  /**
   * This method is used to check whether the select card checkbox is selected or not
   * @readonly
   * @return {Boolean}
   * @memberof Action
   */
  get selectableActionVal() {
    if (this.card && this.stateObj) {
      let fieldName = this.card.selectableField;
      let val = fieldName
        ? this.stateObj[fieldName]
        : this.stateObj._flex
          ? this.stateObj._flex.isSelected
          : false;
      return val;
    }
    return false;
  }

  /**
   * This method is used to return the checkbox styles
   * @readonly
   * @return {String}
   * @memberof Action
   */
  get getCheckboxStyles() {
    let iconstyles =
      this.styles && this.styles.icon ? { ...this.styles.icon } : {};
    return {
      ...this.styles,
      value: {
        ...iconstyles,
        "background-color": this._iconColor
      }
    };
  }

  /**
   * This method is used to return action container class
   * @readonly
   * @return {String}
   * @memberof Action
   */
  get actionContainerClass() {
    return (
      (this.textAlign ? this.textAlign : "") +
      " action-template action-container-truncate " +
      this.extraClass
    );
  }

  get isIconRight() {
    if (this.menuItemData) {
      let data = JSON.parse(decodeURIComponent(this.menuItemData));
      return data.iconPosition?.toLowerCase() === "right";
    }
    return false;
  }

  /**
   * This method is used to check whether we have to display action as button or not
   * @readonly
   * @return {Boolean}
   * @memberof Action
   */
  get _displayAsButton() {
    return this.displayAsButton === "true" || this.displayAsButton === true;
  }

  /**
   * This method is used to check whether we have to hide the label or not
   * @readonly
   * @return {Boolean}
   * @memberof Action
   */
  get _iconOnly() {
    return this.iconOnly === "true" || this.iconOnly === true;
  }

  /**
   * This method is used to check whether we have to show the icon or not
   * @readonly
   * @return {Boolean}
   * @memberof Action
   */
  get showIcon() {
    if (this.hideActionIcon === "true" || this.hideActionIcon === true) {
      return false;
    }
    return this.actionDetails ? this.actionDetails.hasIcon : false;
  }

  /**
   * This method is used to return the action item div class
   * @readonly
   * @return {String}
   * @memberof Action
   */
  get actionItemClass() {
    let classes = `${this.actionWrapperclass ? this.actionWrapperclass : ""} ${
      this.actionDisplay === "horizontal"
        ? this.theme + "-p-horizontal_small "
        : ""
    }`;
    classes +=
      this.actionDetails?.isMenuItem || this.menuItemData
        ? `${this.theme}-action_menu`
        : `${this.theme}-action_item`;
    return classes;
  }

  /**
   * This method is used to return the icon div class
   * @readonly
   * @return {String}
   * @memberof Action
   */
  get iconDivClass() {
    if (this.actionDetails?.isMenuItem || this.menuItemData) {
      return "";
    }
    let classes = `${this.iconWrapperclass ? this.iconWrapperclass : ""} ${
      this.theme
    }-action_icon ${this.theme}-m-around_small`;
    return classes;
  }

  /**
   * This method is used to return the action label class
   * @readonly
   * @return {String}
   * @memberof Action
   */
  get actionTextClass() {
    let classes = `${this.actionLabelclass ? this.actionLabelclass : ""} ${
      this.theme
    }-action_text`;
    return classes;
  }

  /**
   * This method is used to return the action item li class
   * @readonly
   * @return {String}
   * @memberof Action
   */
  get actionLiClass() {
    let classes = `${this.theme}-item ${
      this.actionDisplay === "horizontal" ? this.theme + "-action_inline" : ""
    }`;
    return classes;
  }

  /**
   * This method is used to return the icon class
   * @readonly
   * @return {String}
   * @memberof Action
   */
  get iconClass() {
    if (this.actionDetails?.isMenuItem || this.menuItemData) {
      return `${this.iconExtraclass}`;
    }
    if (
      this.actionDetails &&
      this.actionDetails.iconName &&
      this.actionDetails.iconName.indexOf("utility") !== -1
    ) {
      return `${this.theme}-m-around_xx-small ${this.iconExtraclass}`;
    }
    return `${this.theme}-m-around_xxx-small ${this.iconExtraclass}`;
  }

  /**
   * This method is used to return the icon size
   * @readonly
   * @return {String}
   * @memberof Action
   */
  get iconSizeDef() {
    if (this.iconSize) {
      return this.iconSize;
    } else if (
      this.actionDetails &&
      this.actionDetails.iconName &&
      this.actionDetails.iconName.indexOf("utility") !== -1
    ) {
      return "xx-small";
    }

    return "small";
  }

  // Methods related to standard action

  @api triggerAction() {
    this.startTime = performance.now();
    if (this._definitionObj.datasource) {
      let requestData = JSON.stringify(this._definitionObj.datasource);
      getDataHandler(requestData)
        .then((data) => {
          this.successCallback(data, requestData);
        })
        .catch((error) => {
          this.errorCallback(error);
        });
    } else if (this._definitionObj.data) {
      this.generateUrl(this._definitionObj.data);
    } else {
      this.url = this._definitionObj.url;
    }
  }

  setEndtime() {
    this.endTime = performance.now();
    this.timeTaken = this.endTime - this.startTime + " milliseconds";
  }

  successCallback(data, requestData) {
    this.setEndtime();
    if (!data) {
      try {
        data = requestData && JSON.parse(requestData).defaultData;
      } catch (e) {
        data = "" + requestData;
      }
    }
    data = JSON.parse(data);
    this.generateUrl(data);
    this.debugData = JSON.stringify(data, null, 2);
    this.fireEvent("data", data);
  }

  errorCallback(error) {
    this.setEndtime();
    this.fireEvent("error", error);
    this.error = true;
    this.errormessage = JSON.stringify(error);
  }

  generateUrl(data) {
    if (this._definitionObj && this._definitionObj.url) {
      let url = this._definitionObj.url;
      let parameters = this._definitionObj.parameters;
      if (parameters) {
        Object.keys(parameters).forEach(function (key) {
          url +=
            (url.indexOf("?") > 0 ? "&" : "?") + key + "=" + parameters[key];
        });
      }
      // eslint-disable-next-line no-new-func
      if (data) {
        let obj = { data: data };
        url = url.replace(/\${(.*?)\}/g, (match, expr) => {
          let fieldValue = get(obj, expr);
          return typeof fieldValue !== "undefined" ? fieldValue : match;
        });
      }
      this.url = url;
    } else if (this._definitionObj.navigateTo) {
      let nstring = JSON.stringify(this._definitionObj.navigateTo);
      // eslint-disable-next-line no-new-func
      nstring = new Function("data", "return `" + nstring + "`;").call(
        this,
        data
      );
      this._definitionObj.navigateTo = JSON.parse(nstring);
    }
  }

  toggleSection(event) {
    event.stopPropagation();
    event.preventDefault();
    this.isOpen = !this.isOpen;
    event.target.iconName =
      event.target.iconName === "utility:right"
        ? "utility:down"
        : "utility:right";
  }

  closePopOver() {
    this.isFlyoutOpen = false;
    this.setRenderFlyout(false);
  }
}
