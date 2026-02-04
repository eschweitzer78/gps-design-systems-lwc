import { api, track } from "lwc";
import { maxSafeInt, LOCALE, CURRENCY } from "c/sfGpsDsOsrtSalesforceUtils";
import IMask from "c/sfGpsDsOsrtImask";
import Input from "c/sfGpsDsOsrtInput";
import {
  formatCurrency,
  lwcPropertyNameConversion
} from "c/sfGpsDsOsrtUtility";
import { showMaskWhenOptions } from "./imaskOptions";
import ndsTemplate from "./maskedInput_nds.html";
import sldsTemplate from "./maskedInput_slds.html";
import pubsub from "c/sfGpsDsOsrtPubsub";

/**
 * Masked Input
 * The masked-input component acts as a wrapper for the instantiated IMask object.
 * Values should never be set or retrieved directly form the underlying input. Instead
 * values should be got or set via this._imaskInstance.
 */
export default class MaskedInput extends Input {
  _cachedValue; // When value is set before imask is initialized, it gets store here.
  _showMaskWhen; // Defaults to
  _imaskInstance;
  _currencyDecimal;
  @track _currencyVal = "";
  @track _imask;
  @track _locale;
  @track _currency;

  @track styleProperties = {
    label: {},
    value: {}
  };
  //default mask property
  @api messageWhenMaskIncomplete = "This field is incomplete.";
  @api showMaskWhen;
  @api inputmode;
  @api maskWithSeparator = false;

  @api get locale() {
    return this._locale;
  }
  set locale(val) {
    if (val) {
      this._locale = val;
      this.setCurrencyDecimalValue();
      this.setCurrencyVal(this.value);
    }
  }
  @api get currency() {
    return this._currency;
  }
  set currency(val) {
    if (val) {
      this._currency = val;
      this.setCurrencyDecimalValue();
      this.setCurrencyVal(this.value);
    }
  }

  @api get imask() {
    return this._imask;
  }

  set imask(val) {
    if (val) {
      this._imask = val;
      this.childInput = this.template.querySelector("input");
      if (
        this.childInput &&
        (this.type.toLowerCase() !== "currency" || this.imask)
      ) {
        this._imaskInstance = IMask(this.childInput, val || { mask: /.*/ });
      }
    }
  }

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
    if (val) {
      for (let key in val) {
        if (key === "label") {
          this.updateStyles(val[key], key);
        } else if (key === "value") {
          this.styleProperties[key] = {};
          this.updateStyles(val[key], key);
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

  @api
  get value() {
    // this check this._imaskInstance && this.maskedValue does not work
    // when this.maskedValue = ''
    if (
      this.type.toLowerCase() === "number" ||
      this.type.toLowerCase() === "string"
    ) {
      this.type = "string";
    }

    let returnVal =
      this.type.toLowerCase() === "currency"
        ? this._currencyVal
        : this._imaskInstance && typeof this.maskedValue === "string"
          ? this._imaskInstance.typedValue
          : this._cachedValue;

    returnVal = returnVal !== "" ? returnVal : null;

    if (
      returnVal !== null &&
      this._imaskInstance &&
      (this._imaskInstance.masked.numberMask ||
        (this.imask && this.imask.numberMask))
    ) {
      // If a mask is a number mask typedValue will always return a 0 if empty,
      // overriding that behavior to return null.
      returnVal = this._imaskInstance.value !== "" ? Number(returnVal) : null;
    } else if (this.type.toLowerCase() === "currency" && this._currencyVal) {
      returnVal = Number(this.getUnformattedCurrency(this._currencyVal));
    }

    return returnVal;
  }

  set value(val) {
    this.setValue(val);
  }
  /**
   * Consolidates value setting logic
   * Opens api method to temporarily set value before render cycle for validation logic etc.
   * if calling from an ancestor, be prepared for re-render to potentially overwrite value next cycle.
   * When calling from Ancestor, verify method is present with default to input.value=
   * ugly example:
   *  (typeof input.setValue==='function')&&(input.setValue(val),true)||(input.value=val);
   */
  @api setValue(val) {
    if (!this.imask && this.inputValue === val) return;

    val = val !== undefined && val !== null ? String(val) : "";
    if (this._imaskInstance) {
      this._imaskInstance.typedValue = val;
      // Setting inputValue here allows nds template to display properly.
      this.inputValue = val;
    } else if (this.type.toLowerCase() === "currency" && !this.imask) {
      this.setCurrencyDecimalValue();
      this.setCurrencyVal(val);
      this.inputValue = val;
    } else {
      // Setter was called before imask initialized. Cache the value
      // for use in initialization. See renderedCallback.
      this._cachedValue = val;
    }

    Promise.resolve().then(() => this.setNdsState(val));

    if (
      this._imaskInstance &&
      this._imaskInstance.masked.isComplete === true &&
      this._imaskInstance.masked.currency !== true
    ) {
      // Imask will omit any trailing place-holders even if the
      // input is complete, so we do it manually.
      this.showMaskPlaceholder(true);
    } else if (this._imaskInstance) {
      this.showMaskPlaceholder(false);
    }
  }

  @api
  get typedValue() {
    return this.value;
  }

  set typedValue(val) {
    this.setValue(val);
  }

  @api
  get maskedValue() {
    return this._imaskInstance ? this._imaskInstance.value : "";
  }

  set maskedValue(val) {
    this._imaskInstance.value = val ? val : "";
  }

  get isCurrencySFlocale() {
    return this.type.toLowerCase() === "currency" && !this.imask;
  }

  setCurrencyVal(val) {
    if (val !== undefined && val !== null) {
      val = this.getUnformattedCurrency(val);
      this.uData = this.uData ? this.uData : {};
      if (val === "") {
        this._currencyVal = "";
        return;
      }
      this._currencyVal = formatCurrency(val, {
        anlocale: this.locale || LOCALE || "en-US",
        money: this.currency || CURRENCY || "USD"
      });
    }
  }

  get inputType() {
    if (
      this.type === "number" &&
      this.imask?.thousandsSeparator &&
      this.maskWithSeparator
    ) {
      const separator = this.imask.thousandsSeparator;
      return isNaN(separator) ? "text" : this.type;
    }
    return this.type;
  }

  handleFocus() {
    if (
      this._imaskInstance &&
      this._showMaskWhen === showMaskWhenOptions.WHILE_EDITING &&
      this._imaskInstance.masked.currency !== true
    ) {
      this.showMaskPlaceholder(true);
    }

    this.dispatchEvent(
      new CustomEvent("focus", {
        bubbles: true,
        composed: true
      })
    );
  }

  handleKeyup() {
    this.dispatchEvent(
      new CustomEvent("keyup", {
        bubbles: true,
        composed: true
      })
    );
  }

  handleBlur(evt) {
    if (this.type.toLowerCase() === "currency" && !this.imask) {
      this.setCurrencyVal(evt.target.value);
    }
    this.validateError(evt, this.maskWithSeparator);
    this.setNdsState(evt.target.value);
    if (
      (this._imaskInstance &&
        this._showMaskWhen === showMaskWhenOptions.WHILE_EDITING &&
        this._imaskInstance.masked.isComplete === false) ||
      (this._imaskInstance &&
        this._imaskInstance.masked &&
        this._imaskInstance.masked.currency === true)
    ) {
      this.showMaskPlaceholder(false);
    }

    this.dispatchEvent(
      new CustomEvent("blur", {
        bubbles: true,
        composed: true
      })
    );
  }

  setNdsState() {
    if (
      this.childInput !== null &&
      (this._imaskInstance || this.type.toLowerCase() === "currency") &&
      this.theme === "nds"
    ) {
      if (
        this.value !== "" &&
        this.value !== null &&
        this.value !== undefined
      ) {
        this.childInput.classList.add("nds-not-empty", "nds-is-dirty");
      } else {
        this.childInput.classList.remove("nds-not-empty", "nds-is-dirty");
      }
    }
  }

  /**
   *
   * @param {boolean} show - Force the show
   */
  showMaskPlaceholder(showMask) {
    this._imaskInstance.updateOptions({ lazy: !showMask });
  }

  handleInput() {
    if (this.isInvalidCurrency()) {
      const val = this.childInput.value.replace(/[^0-9.-]/g, "");
      this.childInput.value = val;
    }
    pubsub.fire(this.name, "valuechange", {
      name: this.name,
      value: this.value
    });

    this.dispatchEvent(
      new CustomEvent("input", {
        bubbles: true,
        composed: true
      })
    );
  }

  queryValidity() {
    const validity = super.queryValidity();

    if (
      !this._hasCustomError &&
      this._imaskInstance &&
      validity &&
      !validity.customError
    ) {
      switch (true) {
        case this.required && this.value === null:
          this.childInput.setCustomValidity(this.messageWhenValueMissing);
          break;

        case this.value !== null &&
          this._imaskInstance.masked.isComplete === false:
          this.childInput.setCustomValidity(this.messageWhenMaskIncomplete);
          break;

        case this.imask &&
          this.imask.numberMask &&
          this.value !== null &&
          this.min &&
          this.value < this.min:
          this.childInput.setCustomValidity(this.messageWhenRangeUnderflow);
          break;

        case this.imask &&
          this.imask.numberMask &&
          this.max &&
          this.value > this.max:
          this.childInput.setCustomValidity(this.messageWhenRangeOverflow);
          break;

        case this.imask &&
          this.imask.numberMask &&
          Number(this.value) > Number.MAX_SAFE_INTEGER:
          this.childInput.setCustomValidity(maxSafeInt);
          break;

        case this.imask &&
          !this.imask.numberMask &&
          this.value !== null &&
          this._pattern &&
          !this._pattern.test(String(this.value)):
          this.childInput.setCustomValidity(this.messageWhenPatternMismatch);
          break;

        case this.imask &&
          this.imask.numberMask &&
          this.value !== null &&
          this._pattern &&
          !this._pattern.test(String(this.value)):
          this.childInput.setCustomValidity(this.messageWhenPatternMismatch);
          break;

        default:
          this.childInput.setCustomValidity("");
      }
    }

    return validity;
  }

  render() {
    if (this.theme === "nds") return ndsTemplate;
    return sldsTemplate;
  }

  renderedCallback() {
    if (!this._imaskInstance) {
      this._showMaskWhen =
        showMaskWhenOptions[this.showMaskWhen] || showMaskWhenOptions.default; // defaults to while editing

      if (this.pattern) this._pattern = new RegExp(`^(?:${this.pattern})$`);

      this.childInput = this.template.querySelector("input");
      if (
        this.childInput &&
        (this.type.toLowerCase() !== "currency" || this.imask)
      ) {
        this._imaskInstance = IMask(
          this.childInput,
          this.imask || { mask: /.*/ }
        );
        // The below is to ensure we re-implement the `isActive` property
        // so that it works properly with the Shadow DOM.
        Object.defineProperty(this._imaskInstance.el, "isActive", {
          get: () => {
            return this.childInput === this.template.activeElement;
          }
        });
      }

      if (this._imaskInstance) {
        if (
          this._showMaskWhen === showMaskWhenOptions.WHILE_EDITING ||
          this._showMaskWhen === showMaskWhenOptions.NEVER
        ) {
          // If the mask overlay is to display only while editing, or never
          // set the imask options to lazy (hidden).
          // In the case of while editing, this option will be toggled
          // in the focus and blur handlers.
          this._imaskInstance.updateOptions({ lazy: true });
        } else if (this._showMaskWhen === showMaskWhenOptions.ALWAYS) {
          // Otherwise set lazy to false, and the mask will always be displayed,
          this._imaskInstance.updateOptions({ lazy: false });
        }
      }

      if (this._cachedValue) {
        this.setValue(this._cachedValue);
        delete this._cachedValue;
      }
    }
  }

  isInvalidCurrency() {
    return (
      this.type.toLowerCase() === "currency" &&
      this.childInput !== null &&
      this.childInput.value !== null &&
      /[^0-9.-]/g.test(this.childInput.value)
    );
  }

  setCurrencyDecimalValue() {
    let locale = this.locale || LOCALE || "en-US";
    let currency = this.currency || CURRENCY || "USD";
    var formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency
    });
    let parts = formatter.formatToParts(10);
    for (let i = 0; i < parts.length; ++i) {
      if (parts[i].type === "decimal") {
        this._currencyDecimal = parts[i].value;
        break;
      }
    }
  }

  getUnformattedCurrency(val) {
    if (isNaN(val)) {
      if (!this._currencyDecimal) {
        this.setCurrencyDecimalValue();
      }
      if (this._currencyDecimal !== ".") {
        return val
          .replace(new RegExp("[^0-9" + this._currencyDecimal + "-]", "g"), "")
          .replace(this._currencyDecimal, ".");
      }
      return val.replace(/[^0-9.-]/g, "");
    }
    return val;
  }
  handleChange(event) {
    if (this.type && this.type.toLowerCase() === "currency") {
      this._currencyVal = event.currentTarget.value;
    }
    this.dispatchEvent(
      new CustomEvent("change", {
        bubbles: true,
        composed: true
      })
    );
  }
}
