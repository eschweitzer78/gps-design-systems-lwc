import { track } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import OmniscriptAtomicElement from "c/sfGpsDsOsrtOmniscriptAtomicElement";
import { isRepeatNotation } from "c/sfGpsDsOsrtOmniscriptInternalUtils";
import { RUN_MODES } from "c/sfGpsDsOsrtOmniscriptInternalUtils";

import tmpl from "./omniscriptMessaging_slds.html";
import tmplNds from "./omniscriptMessaging_nds.html";
import tmplToast from "./omniscriptMessaging_toast.html";

const wrapperClassStatic = {
  slds: "slds-scoped-notification slds-scoped-notification_form slds-media slds-media_center slds-scoped-notification_light",
  nds: "nds-is-relative nds-scoped-notification nds-scoped-notification_form"
};

const msgTypeMap = {
  slds: {
    Success: {
      iconName: "utility:success",
      iconVariant: "success",
      wrapperClassDynamic:
        "slds-scoped-notification--success slds-scoped-notification_success"
    },
    Comment: {
      iconName: "utility:comments",
      iconVariant: "default"
    },
    Warning: {
      iconName: "utility:warning",
      iconVariant: "warning",
      wrapperClassDynamic:
        "slds-scoped-notification--warning slds-scoped-notification_warning"
    },
    Requirement: {
      iconName: "utility:error",
      iconVariant: "error",
      ariaRole: "alert",
      wrapperClassDynamic:
        "slds-scoped-notification--error slds-scoped-notification_error"
    },
    empty: {
      iconName: null,
      iconVariant: null
    }
  },
  nds: {
    Success: {
      iconName: "utility:check",
      iconVariant: "success",
      wrapperClassDynamic: "nds-scoped-notification_success"
    },
    Comment: {
      iconName: "utility:chat",
      iconVariant: "default"
    },
    Warning: {
      iconName: "utility:warning",
      iconVariant: "warning",
      wrapperClassDynamic: "nds-scoped-notification_warning"
    },
    Requirement: {
      iconName: "utility:close",
      iconVariant: "error",
      textClass: "nds-text-color--error nds-media nds-media_center",
      ariaRole: "alert",
      wrapperClassDynamic:
        "nds-scoped-notification--error nds-scoped-notification_error"
    },
    empty: {
      iconName: null,
      iconVariant: null
    }
  }
};
/**
 * @module ns/omniscriptMessaging
 * @extends OmniscriptAtomicElement
 * @typicalname omniscriptMessaging
 */
export default class OmniscriptMessaging extends OmniscriptAtomicElement {
  _forceJsonToApply = true;
  _showLabel;
  alternativeText;
  ariaRole = "status";
  /**
   * Data store for text of message.
   * @type String
   * @scope track (private)
   */
  @track messageText;
  /**
   * Data store for type of message.
   * @type String
   * @scope track (private)
   */
  @track messageType;

  /**
   * Overwrites inherited initCompVariables. This method is executed once during connectedCallback.
   * @scope private
   * @returns {void}
   */
  initCompVariables() {
    super.initCompVariables();
    this._showLabel = !this._propSetMap.hideLabel;
  }

  get validationMessage() {
    return this.messageText;
  }

  get wrapperClass() {
    return (
      wrapperClassStatic[this._theme] + " " + (this.wrapperClassDynamic || "")
    );
  }

  get isToast() {
    return this._propSetMap.showMessageAs === "toast";
  }

  /**
   * Special function to determine if component is valid.
   * @scope private
   * @returns {Boolean}
   */
  evaluateValidity() {
    const msgJson = this.getMessageJson();
    return !!(msgJson.type !== "Requirement");
  }

  /**
   * removes the tabindex element from the event target
   * @param {Event} event - the spawning  element.
   * @scope private
   * @returns {void}
   */
  removeTabIndex(event) {
    event.target.removeAttribute("tabindex");
  }

  /**
   * checkValidity should return a Boolean value true, if the input is valid, false if invalid.
   * @returns {Boolean}
   * @scope public
   */
  checkValidity() {
    this.isValid = this.evaluateValidity();
    return this.isValid;
  }

  /**
   * reportValidity should return the value of checkValidity, and trigger the display of any
   * validation messages as well.
   * @returns {Boolean}
   * @scope public
   */
  reportValidity() {
    this.isValid = this.evaluateValidity();
    this._showValidation = !this.isValid;
    return this.isValid;
  }

  showToast() {
    if (this._isDesignMode || !this.messageText) {
      // don't show anything in design mode
      return;
    }
    // in debug mode we're not able to show toast using the LWC api
    if (RUN_MODES.DEBUG === this.runMode) {
      this.dispatchEvent(
        new CustomEvent("lightning__showtoast", {
          bubbles: true,
          composed: true,
          detail: {
            title: this.messageText,
            variant: this.getToastVariant(),
            mode: this.getToastMode()
          }
        })
      );
    } else {
      const event = new ShowToastEvent({
        title: this.messageText,
        variant: this.getToastVariant(),
        mode: this.getToastMode()
      });
      this.dispatchEvent(event);
    }
  }

  getToastVariant() {
    if (this.messageType === "Requirement") {
      return "error";
    }
    if (this.messageType === "Success") {
      return "success";
    }
    if (this.messageType === "Warning") {
      return "warning";
    }
    return "info";
  }

  getToastMode() {
    return this._propSetMap.toastMode || "dismissible";
  }

  /**
   * focuses the input. Overrides from htmlElement. Focuses if from requirement, but only temporarily.
   * @return {void}
   * @scope public
   */
  focus() {
    if (this.messageType === "Requirement") {
      if (this.isToast) {
        this.showToast();
      } else {
        const focusTarget = this.wrapperEle
          ? this.wrapperEle
          : this.template.querySelector("[role]");
        if (focusTarget) {
          focusTarget.setAttribute("tabindex", -1);
          focusTarget.focus();
          focusTarget.addEventListener("blur", this.removeTabIndex, {
            once: true
          });
        }
      }
    }
  }

  /**
   * Gets the current messaging information and returns it as an object that stores the type and text (value).
   * @returns {Object}
   */
  getMessageJson() {
    const currentResult = this.evalConditionUtil(
      this.jsonDef,
      "validate",
      this
    );

    return (
      (this._propSetMap.messages &&
        this._propSetMap.messages.find(
          (x) => x.active && x.value === currentResult
        )) || {
        type: "empty",
        text: null,
        value: currentResult
      }
    );
  }

  /**
   * Overwrites inherited method that gets triggered when data json changes.
   * @return {void}
   * @scope private
   */
  stateRefresh() {
    const previousMessageType = this.messageType;
    const msgJson = this.getMessageJson();
    this.alternativeText = msgJson.type;
    Object.assign(
      this,
      {
        messageText: this.handleMergeFieldUtil(
          msgJson.text,
          this.jsonData,
          this.scriptHeaderDef.labelMap,
          isRepeatNotation(msgJson.text) ? this.jsonDef.JSONPath : null
        ),
        messageType: msgJson.type
      },
      {
        iconName: null,
        iconVariant: null,
        textClass: null,
        ariaRole: "status",
        wrapperClassDynamic: ""
      },
      msgTypeMap[this._theme][msgJson.type]
    );
    this.applyCallResp(msgJson.value);

    if (
      this._propSetMap.showMessageAs === "toast" &&
      this.messageType !== previousMessageType
    ) {
      this.showToast();
    }
  }

  /**
   * Overwrites native LWC render
   * @return {void}
   * @scope private
   */
  render() {
    if (this.isToast) {
      return tmplToast;
    }
    return this.layout === "newport" ? tmplNds : tmpl;
  }

  /**
   * Overwrites native LWC renderedCallback
   * @return {void}
   * @scope private
   */
  renderedCallback() {
    if (this._initialRender) {
      this.wrapperEle = this.template.querySelector("[role]");
    }
    if (typeof super.renderedCallback === "function") {
      super.renderedCallback();
    }
  }
}
