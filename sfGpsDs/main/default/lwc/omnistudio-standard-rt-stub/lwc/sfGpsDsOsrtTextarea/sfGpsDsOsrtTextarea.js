import { LightningElement, api, track } from "lwc";
import { textMask, lwcPropertyNameConversion } from "c/sfGpsDsOsrtUtility";
import { textareaLabels as translatedLabels } from "c/sfGpsDsOsrtSalesforceUtils";

import sldsTemplate from "./textarea_slds.html";
import ndsTemplate from "./textarea_nds.html";

const LINE_BREAK_REGEXP = /(\r\n|\n|\r)/gm;
export default class VlocityTextarea extends LightningElement {
  //SF attributes
  @api placeholder;
  @api name;
  @api messageWhenBadInput = translatedLabels.cmpBadInput;
  @api messageWhenTooShort = translatedLabels.cmpValueTooShort;
  @api messageWhenTooLong = translatedLabels.cmpValueTooLong;
  @api messageWhenReachedMaxLength = translatedLabels.cmpValueReachedMax;

  @api messageWhenValueMissing = translatedLabels.cmpFieldRequired;
  @api accessKey;
  @api maxLength;
  @api minLength;
  @api tabIndex;
  @api disabled;
  @api readOnly;
  @api required;
  @api iconUrl;
  @api mask;
  @api extraclass;
  @api linebreak;
  @track _variant = "standard";
  @api get variant() {
    return this._variant;
  }
  set variant(val) {
    if (val) {
      this._variant = val;
      this.labelVisible = val === "label-hidden" ? false : true;
    }
  }
  @api
  get height() {
    return this._height;
  }
  set height(val) {
    if (val) {
      this._height = val;
      const textarea = this.template.querySelector("textarea");
      if (textarea) {
        textarea.style.height = this.height;
      }
    }
  }
  @api
  get validity() {
    return this._validity;
  }
  @api fieldLevelHelp;
  @api fieldLevelHelpPosition;

  //Custom attributes
  @api theme = "slds";
  @api autocomplete = null;

  @track labelVisible = true;
  @track isError = false;
  @track errorMessage;
  @track warningMessage = "";
  firstRender = true;
  _height = "60px";
  _validity;
  _requiredLabel = translatedLabels.cmpRequired;

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
  @track _val;
  @track _label;

  @api get value() {
    return this._val || "";
  }
  set value(val) {
    if (val) val = String(val);
    this._val = val;
    this.setValue();
  }
  set label(val) {
    if (val) {
      this._label = val;
      this.labelVisible =
        this.variant === "label-hidden" || !val ? false : true;
    }
  }
  @api get label() {
    return this._label;
  }
  @track styleProperties = {
    label: {},
    value: {}
  };

  @api get styles() {
    return this._styles;
  }

  get warningFlag() {
    return (
      !this.isError && this.maxLength && this.maxLength === this.value.length
    );
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

  render() {
    if (this.theme === "nds") {
      return ndsTemplate;
    }
    return sldsTemplate;
  }

  get textAreaClass() {
    return `${this.theme}-textarea ` + (this.extraclass ? this.extraclass : "");
  }

  connectedCallback() {
    this.labelVisible =
      this.variant === "label-hidden" || !this.label ? false : true;
    this.translatedLabels = translatedLabels;
  }

  setValue() {
    let textareaEle = this.template.querySelector("textarea");
    if (textareaEle) {
      textareaEle.value = this.value;
    }
    this.labelVisible =
      this.variant === "label-hidden" || !this.label ? false : true;
  }

  validateError(event) {
    this.setValidity();
    if (this.maxLength && this.maxLength === this.value.length) {
      this.warningMessage = "";
    }
    this.triggerEvent(event);
  }

  triggerEvent = (event) => {
    if (event.type === "focus") {
      this.handleMaxLength();
    }
    if (event) {
      this.dispatchEvent(
        new CustomEvent(event.type, {
          bubbles: true,
          composed: true
        })
      );
    }
  };
  keyCallbacks = (e) => {
    if (this.mask) {
      e.target.value = textMask(e.target.value, this.mask, e);
    }
  };
  renderedCallback() {
    const textarea = this.template.querySelector("textarea");
    if (textarea && this.firstRender) {
      if (this.height) {
        textarea.style.height = this.height;
      }
      this.firstRender = false;
    }
    if (this.theme === "nds") {
      if (textarea.value)
        textarea.classList.add("nds-not-empty", "nds-is-dirty");
      else textarea.classList.remove("nds-not-empty", "nds-is-dirty");
    }
  }
  setValidity() {
    // Do validation customizations.
    // 1. minLength - html spec doesn't apply this constraint when value
    //    is not set by the user.
    // 2. maxLength - same as minLength,
    this._validity = this.template.querySelector("textarea").validity;
    switch (true) {
      case this.value && this.minLength && this.minLength > this.value.length:
        this.setCustomValidity(this.messageWhenTooShort);
        break;
      case this.value && this.maxLength && this.maxLength < this.value.length:
        this.setCustomValidity(this.messageWhenTooLong);
        break;
      // OWC-1630 - the bug is that once the user enters a string that violates minLength or
      // maxLength, they can never get back to valid state even if they fix the input
      case ((this.value &&
        (this.value.length >= this.minLength || isNaN(this.minLength)) &&
        (this.value.length <= this.maxLength || isNaN(this.maxLength))) ||
        !this.value) &&
        (this.errorMessage === this.messageWhenTooShort ||
          this.errorMessage === this.messageWhenTooLong):
        this.setCustomValidity("");
        break;
      default:
        if (!this._validity.customError) {
          this.setCustomValidity("");
        }
    }

    this.isError = !this._validity.valid;
    if (this._validity.valueMissing) {
      this.errorMessage = this.messageWhenValueMissing;
    } else if (this._validity.tooShort) {
      this.errorMessage = this.messageWhenTooShort;
    } else if (this._validity.badInput) {
      this.errorMessage = this.messageWhenBadInput;
    } else if (this._validity.customError) {
      // Error message is already set.
    } else {
      this.isError = false;
      this.errorMessage = "";
    }
  }

  get containerClass() {
    return `${this.theme}-form-element ${this.theme}-form-container ${
      this.isError ? `${this.theme}-has-error` : ``
    }`;
  }

  updateValue(event) {
    this._val = event.target.value;
    this.handleMaxLength();
    this.reportValidity();
  }

  @api
  checkValidity() {
    this._validity = this.template.querySelector("textarea").validity;
    return this._validity.valid;
  }

  @api
  reportValidity() {
    this.setValidity();
    return this._validity.valid;
  }

  @api
  setCustomValidity(message) {
    this.template.querySelector("textarea").setCustomValidity(message);
    this.isError = message ? true : false;
    this.errorMessage = message;
  }

  @api
  focus() {
    this.template.querySelector("textarea").focus();
  }

  @api
  blur() {
    this.template.querySelector("textarea").blur();
  }

  @api
  showHelpMessageIfInvalid() {
    this.setValidity();
  }
  // your properties and methods here

  /**
   * Return formatted multiline inputs for textArea. \n & \r are converted to <br>
   * Used by flexcards textArea element.
   */
  @api get htmlFormattedValue() {
    if (typeof this.value === "string" && this.linebreak) {
      return this.value.replaceAll(LINE_BREAK_REGEXP, "<br>");
    }
    return this.value;
  }

  handleMaxLength() {
    if (this.maxLength && this.maxLength === this.value.length) {
      this.warningMessage = this.messageWhenReachedMaxLength.replace(
        /\{0\}/g,
        this.maxLength
      );
    }
  }
}
