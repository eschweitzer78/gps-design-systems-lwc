import { LightningElement, api, track } from "lwc";
import pubsub from "c/sfGpsDsOsrtPubsub";
import { lwcPropertyNameConversion } from "c/sfGpsDsOsrtUtility";
import { inputLabels as translatedLabels } from "c/sfGpsDsOsrtSalesforceUtils";

import sldsTemplate from "./radioGroup_slds.html";
import ndsTemplate from "./radioGroup_nds.html";

let radioIdGen = 0;

export default class VlocityRadioGroup extends LightningElement {
  @api label;
  @api tabIndex;

  /* api: value */

  @api
  get value() {
    return this._val;
  }

  set value(val) {
    this._val = typeof val === "boolean" ? JSON.stringify(val) : val;
    this.setValue();
  }

  /* api: options */

  @api
  get options() {
    return this._options;
  }

  set options(options) {
    this._options = options;
    this.internalOpts = this._options.map((option, index) => {
      const value =
        typeof option.value === "boolean"
          ? JSON.stringify(option.value)
          : option.value;
      return {
        ...option,
        id: this.radioId + "-" + index,
        name: this.radioId,
        selected: this.value ? value === this.value : false
      };
    });
  }

  /* api: type */

  @api
  get type() {
    return this._type;
  }

  set type(val) {
    this._type = val;
    this.isbutton = this.type === "button" ? true : false;
    if (this.isbutton) {
      this.classList.add(`${this.theme}-size_1-of-1`);
    }
  }

  @api messageWhenValueMissing = "This field is required.";
  @api required;
  @api disabled;
  @api extraclass;
  @api name;
  @api fieldLevelHelp;
  @api fieldLevelHelpPosition;

  /* api: helpText */

  @api
  get helpText() {
    return this.fieldLevelHelp;
  }

  set helpText(helpText) {
    //this.fieldLevelHelp = helpText;
    console.warn(
      "helpText is a deprecated property. Please use fieldLevelHelp instead."
    );
  }

  /* api: requiredLabel */

  _requiredLabel = translatedLabels.cmpRequired;

  @api
  get requiredLabel() {
    return this._requiredLabel;
  }

  set requiredLabel(val) {
    if (val) {
      this._requiredLabel = val;
    } else {
      this._requiredLabel = translatedLabels.cmpRequired;
    }
  }

  _initialRender = true;
  @api theme = "slds";
  @api alignment;
  @track _val;
  @track internalOpts = [];
  _options = [];
  @track isbutton = false;
  @track errorMessage;
  @track isError;
  @track _type = "radio";
  @api get validity() {
    return this._validity;
  }

  _validity = {
    badInput: false,
    customError: false,
    patternMismatch: false,
    rangeOverflow: false,
    rangeUnderflow: false,
    stepMismatch: false,
    tooLong: false,
    tooShort: false,
    typeMismatch: false,
    valid: true,
    valueMissing: false
  };

  setValue() {
    if (this.radioId == null) this.radioId = "vlocity-radio-" + radioIdGen++;
    this.internalOpts = this._options.map((option, index) => {
      const value =
        typeof option.value === "boolean"
          ? JSON.stringify(option.value)
          : option.value;
      return {
        ...option,
        id: this.radioId + "-" + index,
        name: this.radioId,
        selected: this._val ? value === this._val : false
      };
    });
  }

  render() {
    if (this.theme === "nds") {
      return ndsTemplate;
    }
    return sldsTemplate;
  }

  connectedCallback() {
    this.isbutton = this.type === "button" ? true : false;
    if (this.isbutton) {
      this.classList.add(`${this.theme}-size_1-of-1`);
    }
    if (this.radioId == null) this.radioId = "vlocity-radio-" + radioIdGen++;
  }

  @track styleProperties = {
    label: {},
    value: {}
  };

  /* styles */

  @api
  get styles() {
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
    if (this.styles) {
      for (let key in this.styles) {
        if (this._styles.hasOwnProperty(key)) {
          this.styleProperties[key] = {};
          if (key === "label") {
            this.styleProperties.label.styles = "";
            this.updateStyles(this.styles[key], key);
          } else if (key === "value") {
            this.updateStyles(this.styles[key], key);
          }
        }
      }
    }
  }

  updateStyles(styleObj, styleKey) {
    let keys = Object.keys(styleObj);
    keys.forEach((key) => {
      if (!this.styleProperties[styleKey].styles) {
        this.styleProperties[styleKey].styles = "";
      }
      this.styleProperties[styleKey].styles += `${lwcPropertyNameConversion(
        key
      )}:${styleObj[key]};`;
    });
  }

  processClassNamesForTheme = function (classlist, theme) {
    return classlist.split("$theme").join(theme);
  };

  get errorClass() {
    const ndsClasses =
      (this.theme === "nds"
        ? "$theme-form-element $theme-form-container "
        : "") +
      (this.isError ? "$theme-has-error " : "") +
      (this.extraclass ? " " + this.extraclass : "");
    return this.processClassNamesForTheme(ndsClasses, this.theme);
  }

  onchangevalue(event) {
    let element = event.target;
    this._val = element.value;
    this.setValue();
    this.setValidity();
    pubsub.fire(this.name, "valuechange", {
      name: this.name,
      value: this.value
    });
    this.dispatchEvent(
      new CustomEvent("change", {
        composed: true,
        bubbles: true
      })
    );
  }

  handleFocus(evt) {
    this.dispatchEvent(
      new CustomEvent("focus", {
        composed: true,
        bubbles: true,
        detail: evt.target.value
      })
    );
  }

  handleBlur(evt) {
    this.reportValidity();
  }

  setValidity(showError) {
    if (!this._validity.customError) {
      this.isError = false;
      this.errorMessage = "";
    }
    if (!this.value && this.required) {
      this._validity.valueMissing = true;
      if (showError) {
        this.isError = true;
        this.errorMessage = this.messageWhenValueMissing;
      }
    } else {
      // ideally we should also check against options
      this._validity.valueMissing = false;
    }
    this._validity.valid =
      !this._validity.customError && !this._validity.valueMissing;
  }

  @api
  checkValidity() {
    this.setValidity(false);
    return this._validity && this._validity.valid;
  }

  @api
  reportValidity() {
    this.setValidity(true);
    return this._validity.valid;
  }

  @api
  setCustomValidity(message) {
    this._validity.customError = message === "" ? false : true;
    this.isError = message === "" ? false : true;
    this.errorMessage = message;
  }

  @api
  focus() {
    this.template.querySelector("input").focus();
  }

  @api
  showHelpMessageIfInvalid() {
    this.setValidity(true);
  }

  renderedCallback() {
    if (this._initialRender) {
      if (this.alignment === "horizontal") {
        this.template
          .querySelector(`.${this.theme}-form-element__control`)
          .classList.add(
            this.theme === "slds" ? "slds-grid" : "nds-horizontal_radio"
          );
      } else if (this.theme === "nds" && this.alignment === "vertical") {
        this.template
          .querySelector(`.${this.theme}-form-element__control`)
          .classList.add(`${this.theme}-vertical_radio`);
      }
      this._initialRender = false;
    }
  }

  handleKeyDownEvent(evt) {
    switch (evt.key) {
      case "Tab":
        this.reportValidity();
        break;
      default:
    }
  }
}
