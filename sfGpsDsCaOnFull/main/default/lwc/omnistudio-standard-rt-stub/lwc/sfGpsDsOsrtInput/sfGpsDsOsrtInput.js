import { LightningElement, api, track } from "lwc";
import pubsub from "c/sfGpsDsOsrtPubsub";
import sldsTemplate from "./input_slds.html";
import ndsTemplate from "./input_nds.html";
import {
  inputMask,
  formatCurrency,
  loadScript,
  javascriptNumberFormatter
} from "c/sfGpsDsOsrtUtility";
import { inputLabels as translatedLabels } from "c/sfGpsDsOsrtSalesforceUtils";
import { lwcPropertyNameConversion } from "c/sfGpsDsOsrtUtility";
let inputIdGenerator = 0;

export default class VlocityInput extends LightningElement {
  @api placeholder;
  @api name;
  typesWithExtraLabels = ["radio", "checkbox", "toggle", "file", "formula"];
  set label(val) {
    if (val) {
      this._label = val;
      this.labelVisible =
        this.variant === "label-hidden"
          ? false
          : this.typesWithExtraLabels.indexOf(this.type) !== -1
            ? false
            : true;
    }
  }
  @api get label() {
    return this._label;
  }

  @api iconColor;
  _messageWhenBadInput;
  @api get messageWhenBadInput() {
    if (this._messageWhenBadInput) {
      return this._messageWhenBadInput;
    }
    // if not overridden then use the appropriate default.
    return this.isDate || this.isDateTime
      ? translatedLabels.cmpDateFieldNotValid
      : translatedLabels.cmpFieldNotValid;
  }
  set messageWhenBadInput(messageWhenBadInput) {
    this._messageWhenBadInput = messageWhenBadInput;
  }
  @api messageWhenValueMissing = translatedLabels.cmpFieldValueMissing;
  @api messageWhenPatternMismatch = translatedLabels.cmpPatternNoMatch;
  @api messageWhenRangeOverflow = translatedLabels.cmpRangeOverflowError;
  @api messageWhenRangeUnderflow = translatedLabels.cmpRangeUnderflowError;
  @api messageWhenStepMismatch = translatedLabels.cmpStepMismatchError;
  @api messageWhenTooShort = translatedLabels.cmpFieldTooShort;
  @api messageWhenTooLong = translatedLabels.cmpFieldTooLong;
  @api messageWhenTypeMismatch = translatedLabels.cmpTypeMismatchError;
  @api messageWhenReachedMaxLength = translatedLabels.cmpValueReachedMax;

  @api ariaLabel;
  @api ariaControls = "id";
  @api ariaLabelledBy = null;
  @api ariaDescribedBy = null;
  @api autocomplete = null;
  @api skipMaskingOnKeyevents = false;
  @api get type() {
    return this._type || "text";
  }
  set type(val) {
    this._type = val;
    this.isNumber = this.type === "number" ? true : false;
    this.initOptions();
  }
  @api get formatter() {
    return this._formatter;
  }
  set formatter(val) {
    this._formatter = val;
    this.isMaskSet = false;
    this.initOptions();
  }
  @api pattern;
  @api accept;
  @api maxLength;
  @api minLength;
  @api max;
  @api min;

  /** @deprecated As of [WCOM-598] please use `type="formula"`. */
  @api isFormula;
  @api get step() {
    return this._step;
  }
  set step(val) {
    this._step = val;
  }
  @api multiple;
  @api
  get value() {
    return this.validateValue(this.inputValue);
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
    if (this.type === "file") {
      try {
        this.inputValue =
          (typeof val === "string" && val.indexOf("]")) !== -1
            ? JSON.parse(val)
            : typeof val === "object" && val.length
              ? val
              : [];
      } catch (e) {
        this.inputValue = [];
      }
    } else {
      const type = typeof val;
      this.inputValue =
        type === "string" ||
        type === "number" ||
        (val && val.constructor === Date)
          ? val
          : this.type === "text" && type === "boolean"
            ? JSON.stringify(val)
            : "";
      this.isMaskSet = false;
    }

    // temporariily setting the value direclty to get instantaneous response for parsing and validation
    if (
      this.type.match(/^(date|time|datetime)$/) &&
      this.childInput &&
      typeof this.childInput.setValue === "function"
    ) {
      this.childInput.setValue(this.inputValue);
    }

    if (
      this.formatter === "currency" &&
      !this.mask &&
      this.isNumber &&
      this.type !== "number"
    ) {
      this._type = "text";
      Promise.resolve().then(() => {
        this.formatValue(this.inputValue);
      });
    }
    if (this.formatter === "percent-fixed" && this.isNumber) {
      this.formatValue(this.inputValue);
    }
  }
  get _value() {
    return this.value;
  }
  @api
  get maskedValue() {
    return this.inputValue && this.mask ? this.inputValue : "";
  }

  @api get displayValue() {
    return this.childInput.displayValue || this.maskedValue || this.value || "";
  }
  @api get ignoreMask() {
    return this._ignoreMask;
  }
  set ignoreMask(val) {
    this._ignoreMask = val === "true" || val === true;
  }
  @api variant;
  @api disabled;
  @api readOnly;
  @api required;
  @api get files() {
    return this.isFile ? this.value : null;
  }

  @api get validity() {
    return this.template.querySelector("input").validity;
  }
  @api get validationMessage() {
    return (
      this.template.querySelector("input")?.validationMessage ||
      this.customValidationMessage
    );
  }

  @api customValidationMessage;

  @api fieldLevelHelp;
  @api fieldLevelHelpPosition;
  @api tabIndex = "0";
  @api accessKey;
  @api dateAriaLabel;
  @api dateAriaLabelledBy;
  @api timeAriaLabelledBy;
  @api timeAriaDescribedBy;
  @api dateAriaDescribedBy;

  //custom attribute
  @api theme = "slds";
  @api static;
  @api pretext;
  @api posttext;
  @api inlineHelp;
  @api iconUrl;
  @api iconName = "utility:info";
  @api iconVariant;
  @api toggleOnLabel;
  @api toggleOffLabel;

  //Date attribute
  @api dateTimeLocaleFormat;
  @api dateTimeLocaleFormatInvalidError;
  @api position;
  @api size;
  @api format;
  @api range;
  @api endDatePickerLabel;
  @api endDate;
  @api novalidate;
  @api prevMonthLabel;
  @api nextMonthLabel;
  @api pickYearLabel;
  @api todayLabel;
  @api selectDateLabel;

  //time attribute
  @api outputType = "string";
  @api outputFormat;
  @api interval;

  //datetime attribute
  @api dateLabel = translatedLabels.cmpDate;
  @api timeLabel = translatedLabels.cmpTime;
  @api datePlaceholder = translatedLabels.cmpSelectDate;
  @api timePlaceholder = translatedLabels.cmpSelectTime;
  @api dateName = "date";
  @api timeName = "time";
  @api dateFormat = "YYYY-MM-DD";
  @api timeFormat = "HH:mm";

  @track labelVisible = true;
  @api checked;
  @track isError = false;
  @track errorMessage;
  @track warningMessage = "";
  @track inputValue = "";
  @track isFile;
  @track isCheckbox = false;
  @track isToggle;
  @track isInput;
  @track isRadio;
  @track inputId;
  @track isDate;
  @track isTime;
  @track isDateTime;
  @track isCustomLwc;
  @track _label;
  @track isNumber = false;
  @track _ignoreMask = false;
  @api get mask() {
    return this._mask;
  }
  set mask(val) {
    this._mask = val;
  }

  get warningFlag() {
    return (
      !this.isError &&
      this.maxLength &&
      this.maxLength === this.inputValue.length
    );
  }
  @api maskPlaceholder = false;
  @api maskRange;
  isMaskSet = false;
  newMask = false;

  _validity;
  _innerElement;
  _formatterLoaded;
  _isFormula = false;

  @api iconNameLeft;
  @api iconNameRight;
  @api iconClickCallback;
  @track isIconRightClickable;
  @track isIconLeftClickable;
  @track isIconRight;
  @track isIconLeft;
  @track icon = "right";
  @track _type;
  @track _formatter;
  @track _step;
  @track _mask;
  @api timezone;
  @api checkboxLabelIconName;
  @track inputClass;
  @track styleProperties = {
    label: {},
    value: {}
  };
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
  translatedLabels = {};

  get isIconAvailable() {
    return this.isIconLeft || this.isIconRight ? true : false;
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

  render() {
    if (this.theme === "nds") return ndsTemplate;
    return sldsTemplate;
  }

  connectedCallback() {
    this.initOptions();
  }

  get resolvedInputClass() {
    return this.setInputClass();
  }

  initOptions() {
    this.isIconLeftClickable = this.iconClickCallback && this.iconNameLeft;
    this.isIconLeft = (!this.isIconLeftClickable && this.iconNameLeft) || false;
    this.isIconRightClickable = this.iconClickCallback && this.iconNameRight;
    this.isIconRight =
      (!this.isIconRightClickable && this.iconNameRight) || false;
    this.inputValue =
      this.type === "text" && typeof this.inputValue === "object"
        ? ""
        : this.type === "file" && !this.inputValue.length
          ? []
          : this.inputValue;

    if (this.isIconLeft && this.isIconRight) {
      this.icon = "left-right";
    } else if (this.isIconLeft) {
      this.icon = "left";
    } else if (this.isIconRight) {
      this.icon = "right";
    }
    this.labelVisible = false;
    this._innerElement = "input";
    switch (this.type) {
      case "file":
        this.isFile = true;
        break;
      case "checkbox":
        this.isCheckbox = true;
        this.isInput = false;
        break;
      case "toggle":
        this.isToggle = true;
        break;
      case "radio":
        this.isRadio = true;
        break;
      case "date":
        this.isDate = true;
        this.isCustomLwc = true;
        this._innerElement = "c-sf-gps-ds-osrt-date-picker";
        break;
      case "time":
        this.isTime = true;
        this.isCustomLwc = true;
        this._innerElement = "c-sf-gps-ds-osrt-time-picker";
        break;
      case "datetime":
        this.isCustomLwc = true;
        this.isDateTime = true;
        this._innerElement = "c-sf-gps-ds-osrt-datetime-picker";
        break;
      case "formula":
        this._isFormula = true;
        break;
      default:
        this.labelVisible =
          this.variant === "label-hidden" || !this.label ? false : true;
        this.isInput = true;
        break;
    }
    this.inputId = "input" + inputIdGenerator++;
    const _this = this;
    if (_this.formatter === "currency" && _this.mask) {
      loadScript(this, javascriptNumberFormatter).then(function () {
        _this._formatterLoaded = true;
        /*global format:true*/
        _this.inputValue = format(_this.mask, _this.inputValue);
      });
    }
    if (this.formatter === "currency" && !this.mask && this.isNumber) {
      this._type = "text";
      this.formatValue(this.inputValue);
    }
    if (this.formatter === "percent-fixed" && this.isNumber) {
      this.formatValue(this.inputValue);
    }
    this.translatedLabels = translatedLabels;
  }

  triggerEvent = (event) => {
    this.dispatchEvent(
      new CustomEvent(event.type, {
        bubbles: true,
        composed: true
      })
    );
  };
  triggerKeyEvents = (e) => {
    if (
      this.mask &&
      (this.skipMaskingOnKeyevents === false ||
        this.skipMaskingOnKeyevents === "false")
    ) {
      this.inputValue = inputMask(
        e.target.value,
        this.mask,
        this.maskRange,
        this.maskPlaceholder,
        e
      );
    }
  };
  renderedCallback() {
    const input = this.template.querySelector(".vlocity-input");

    if (this.type.match(/^(date|time|datetime)$/)) {
      this.childInput = this.template.querySelector(this._innerElement);
    }
    if (this.isNumber && !this.ignoreMask) {
      //To set initial mask to number type input where mask is not set by user and we make it default to “###,###”
      this._type = "text";
      if (!this.mask && this.formatter !== "currency")
        this.formatValue(this.inputValue);
    }
    // To set step value according to input mask.
    if (!this.isMaskSet && this.mask) {
      if (this.mask && this.mask.lastIndexOf(".") !== -1 && !this.newMask) {
        let decimal = this.mask.lastIndexOf(".");
        let i = decimal + 1;
        let decimalCount = 0;
        if (this.mask[i]) {
          while (this.mask[i] && /^[0-9]$/.test(this.mask[i])) {
            decimalCount++;
            i++;
          }
          this._step = this.step
            ? this.step
            : decimalCount
              ? "0." + "0".repeat(decimalCount - 1) + "1"
              : 1;
        }
      }
      this.isMaskSet = true;
      this.inputValue =
        this.formatter !== "currency" &&
        this.mask &&
        this.inputValue &&
        this.type.toLowerCase() !== "date"
          ? inputMask(
              this.inputValue,
              this.mask,
              this.maskRange,
              this.maskPlaceholder
            )
          : this.inputValue;
    }

    if (
      this.theme === "nds" &&
      (!this.isRendered ||
        (this.inputValue && this.isEmpty) ||
        (!this.inputValue && !this.isEmpty))
    ) {
      this.isRendered = true;
      this.isEmpty = this.inputValue ? false : true;
      if (input) {
        if (this.inputValue)
          input.classList.add("nds-not-empty", "nds-is-dirty");
        else input.classList.remove("nds-not-empty", "nds-is-dirty");
      }
    }
  }
  handleFocus(event) {
    this.handleMaxLength();
    if (!this.ignoreMask) {
      this.removeMask(event);
    }
    this.triggerEvent(event);
  }

  closeTooltip(event) {
    const tooltip = this.template.querySelector("[data-field-level-help]");
    if (tooltip) {
      tooltip.closeTooltip();
    }
    if (event) {
      this.triggerEvent(event);
    }
  }

  removeMask(event) {
    //To remove mask for type = number
    let target = event.target;
    if (this.isNumber) {
      this.inputValue = JSON.stringify(this.inputValue).replace(
        /[^0-9.-]/g,
        ""
      );
      this.inputValue =
        Number(this.inputValue) === Math.round(this.inputValue)
          ? Number(this.inputValue).toString()
          : this.inputValue;
    }
    this.inputValue = this.inputValue
      ? this.formatter === "percent"
        ? Number(this.inputValue) * 0.01
        : this.inputValue
      : "";
    if (!this.isNumber && this.mask && this.maskRange && this.maskPlaceholder) {
      let val = event.target.value ? event.target.value : "";
      this.inputValue = inputMask(
        val,
        this.mask,
        this.maskRange,
        this.maskPlaceholder
      );
      // eslint-disable-next-line @lwc/lwc/no-async-operation
      setTimeout(() => {
        if (
          this.inputValue.indexOf("_") !== -1 &&
          target &&
          target.selectionStart &&
          target.selectionEnd
        )
          target.selectionStart = target.selectionEnd =
            this.inputValue.indexOf("_");
      });
    }
  }

  formatValue(value) {
    if (this.formatter === "percent") {
      if (value) this.inputValue = parseFloat(value / 0.01).toFixed(2);
      this._mask = "##.00%";
      return this.inputValue;
    } else if (this.formatter === "currency" && this.mask) {
      if (this._formatterLoaded) {
        //no-undef
        this.inputValue = format(this.mask, value);
      }
      return this.inputValue;
    } else if (this.formatter === "currency") {
      this.inputValue = formatCurrency(this.validateValue(value));
      return this.inputValue;
    } else if (this.formatter === "percent-fixed") {
      if (value) this.inputValue = parseFloat(value).toFixed(2);
      this._mask = "##.00%";
      return this.inputValue;
    }
    if (!this.mask || this.newMask) {
      this.newMask = true;
      let decimalCount =
        value && JSON.stringify(value).indexOf(".") !== -1
          ? (value + "").split(".")
          : "";
      decimalCount = decimalCount
        ? decimalCount[decimalCount.length - 1].length
        : "";
      this._mask =
        decimalCount > 0 ? "###,###." + "0".repeat(decimalCount) : "###,###";
    }
    return this.inputValue;
  }

  validateValue(value) {
    //To return value as a number when input is type number without mask
    if (this.isNumber) {
      return this.inputValue !== "" // updated to this.inputValue !== "" as it failes on 0
        ? !this.ignoreMask
          ? Number.parseFloat(
              JSON.stringify(this.inputValue).replace(/[^0-9.-]/g, "")
            )
          : this.inputValue
        : ""; //removing the || condition, because when valus is 0 it returns empty
    } else if (this.type === "text" && this.mask) {
      return this.inputValue.replace(/[^0-9.-]/g, "");
    } else if (this.isTime || this.isDate || this.isDateTime) {
      let el = this.template.querySelector(this._innerElement);
      return el ? el.value : value;
    }

    return value || "";
  }

  validateError(event, isMaskedInput) {
    if (event && this.isNumber && !this.ignoreMask && !isMaskedInput) {
      //To set mask for type = number
      event.target.value = this.formatValue(event.target.value);
      this.inputValue =
        this.formatter !== "currency" &&
        this.mask &&
        this.inputValue &&
        this.type.toLowerCase() !== "date"
          ? inputMask(
              event.target.value,
              this.mask,
              this.maskRange,
              this.maskPlaceholder
            )
          : this.inputValue;
    } else if (event && event.target && event.target.value) {
      if (
        event.target.value.replace(/\D/g, "").length === 0 &&
        this.maskRange &&
        this.maskPlaceholder
      )
        this.inputValue = "";
      if (event.target.value.trim().length === 0) this.inputValue = "";
    }
    Promise.resolve().then(() => {
      this.setValidity();
    });
    if (this.maxLength && this.maxLength === this.inputValue.length) {
      this.warningMessage = "";
    }
    this.closeTooltip();
    this.triggerEvent(event);
  }

  setValidity() {
    // in case if we need to prevent default validation
    if (this.novalidate) {
      return;
    }
    this._validity = this.queryValidity();
    this.isError = this._validity && !this._validity.valid;
    if (this.isNumber && !this.isError) {
      this._validity = this.template.querySelector(".hiddenNumber").validity;
      this.isError = !this._validity.valid;
    }
    if (this._validity) {
      switch (true) {
        case this._validity.valid:
          this.isError = false;
          this.errorMessage = "";
          break;
        case this._validity.valueMissing:
          this.errorMessage = this.messageWhenValueMissing;
          break;
        case this._validity.tooShort:
          this.errorMessage = this.messageWhenTooShort;
          break;
        case this._validity.tooLong:
          this.errorMessage = this.messageWhenTooLong;
          break;
        case this._validity.badInput:
          this.errorMessage = this.messageWhenBadInput;
          break;
        case this._validity.patternMismatch:
          this.errorMessage = this.messageWhenPatternMismatch;
          break;
        case this._validity.rangeOverflow:
          this.errorMessage = this.messageWhenRangeOverflow;
          break;
        case this._validity.rangeUnderflow:
          this.errorMessage = this.messageWhenRangeUnderflow;
          break;
        case this._validity.stepMismatch:
          this.errorMessage = this.messageWhenStepMismatch;
          break;
        case this._validity.typeMismatch:
          this.errorMessage = this.messageWhenTypeMismatch;
          break;
        case this._validity.customError:
          this.errorMessage = this.validationMessage;
          break;
        default:
          this.errorMessage = this.errorMessage ? this.errorMessage : "";
      }
    }
    Promise.resolve().then(() => {
      const inputElement = this.template.querySelector(".vlocity-input");
      const ariaDescAttr = this.resolveAriaDescribedBy();
      if (inputElement) {
        if (ariaDescAttr) {
          inputElement.setAttribute("aria-describedby", ariaDescAttr);
        } else {
          inputElement.removeAttribute("aria-describedby");
        }
      }
    });
  }

  get isAriaInvalid() {
    return this.isError ? "true" : "false";
  }

  queryValidity() {
    const input = this.template.querySelector(this._innerElement);

    // Do validation customizations.
    if (!this._hasCustomError) {
      // 1. minLength - html spec doesn't apply this constraint when value
      //    is not set by the user.
      // 2. maxLength - same as minLength,
      switch (true) {
        case this.inputValue &&
          this.minLength &&
          this.minLength > this.inputValue.length:
          input.setCustomValidity(this.messageWhenTooShort);
          break;
        case this.maxLength && this.maxLength < this.inputValue.length:
          input.setCustomValidity(this.messageWhenTooLong);
          break;
        default:
          input.setCustomValidity("");
      }
    }

    return input.validity;
  }

  resolveAriaDescribedBy() {
    const errorBlockElement = this.template.querySelector(
      `.${this.theme}-form-element__help`
    );
    const errorBlockId = errorBlockElement ? errorBlockElement.id : null;
    if (errorBlockId) {
      return this.ariaDescribedBy
        ? `${this.ariaDescribedBy} ${errorBlockId}`
        : errorBlockId;
    }
    return this.ariaDescribedBy;
  }

  get allAriaDescribedBy() {
    const errorMessageEl = this.template.querySelector("[data-error-message]");
    const items = this.ariaDescribedBy ? [this.ariaDescribedBy] : [];
    if (errorMessageEl) {
      items.concat(errorMessageEl.id);
    }
    if (items.length > 0) {
      return items.join(" ");
    }
    return null;
  }

  deleteFile(event) {
    this.inputValue.splice(event.target.dataset.index, 1);
  }
  bytesToSize(bytes) {
    var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 Byte";
    let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
    return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
  }
  triggerInputEvent(event) {
    let val;
    if (this.type === "file") {
      let file = event.target.files[0];
      this.inputValue.push({
        id: "file-name-" + inputIdGenerator++,
        filename: file.name,
        size: this.bytesToSize(file.size)
      });
      event.target.value = "";
    } else this.inputValue = event.target.value;
    val = this.inputValue;

    if (this.isCheckbox || this.isRadio || this.isToggle) {
      this.checked = event.target.checked;
      val = this.checked;
      if (this.checked && this.isRadio) {
        val = this.inputValue;
      }
    }

    this.handleMaxLength();

    pubsub.fire(this.name, "valuechange", {
      name: this.name,
      value: val
    });
    this.triggerEvent(event);
  }

  processClassNamesForTheme = function (classlist, theme) {
    return classlist.split("$theme").join(theme);
  };

  get errorClass() {
    const ndsClasses =
      "$theme-form-element $theme-form-container" +
      (this.isError ? " $theme-has-error" : "") +
      (this.isCheckbox ? " $theme-relative-tooltip $theme-wrap" : "");
    return this.processClassNamesForTheme(ndsClasses, this.theme);
  }

  get pretextClass() {
    const ndsClasses =
      "$theme-form-element__control" +
      (!this.isCheckbox ? " $theme-form-element__control-animated-label" : "") +
      (this.pretext || this.posttext ? " $theme-input-has-fixed-addon" : "") +
      (this.isIconAvailable
        ? ` ${this.theme}-input-has-icon ${this.theme}-input-has-icon_${this.icon}`
        : ``);
    return this.processClassNamesForTheme(ndsClasses, this.theme);
  }

  setInputClass() {
    let _inputClass = `vlocity-input ${this.theme}-input`;
    _inputClass += this.theme === "nds" ? " nds-input_mask" : "";
    _inputClass += this.isIconLeftClickable
      ? ` ${this.theme}-input__input-clickable-icon-left`
      : "";
    _inputClass += this.isIconRightClickable
      ? ` ${this.theme}-input__input-clickable-icon-right`
      : "";
    return _inputClass;
  }

  @api
  checkValidity() {
    if (this._innerElement.match(/^c-/)) {
      return this.template.querySelector(this._innerElement).checkValidity();
    }
    this._validity = this.queryValidity();
    return this._validity && this._validity.valid;
  }

  @api
  reportValidity() {
    if (this._innerElement.match(/^c-/)) {
      return this.template.querySelector(this._innerElement).reportValidity();
    }
    this.setValidity();
    if (this.isNumber && !this.formatter && this.isInvalidNumber()) {
      return false;
    }
    return this._validity && this._validity.valid;
  }

  /**
   * Exposing underlying dom's setCustomValidity as an @api method. Not to be used
   * from this component or extensions.
   * @param {string} message - Message to be displayed when reportValidity is invoked.
   */
  @api
  setCustomValidity(message) {
    this.template.querySelector(this._innerElement).setCustomValidity(message);
    this._hasCustomError = Boolean(message);
    this.errorMessage = message;
  }
  @api
  resetValidations() {
    this.isError = false;
    this.setCustomValidity("");
  }

  @api
  focus() {
    this.template.querySelector(this._innerElement).focus();
  }

  @api
  blur() {
    this.template.querySelector(this._innerElement).blur();
  }

  @api
  showHelpMessageIfInvalid() {
    this.setValidity();
  }
  isInvalidNumber() {
    return isNaN(this.validateValue(this.inputValue));
  }
  get showPretext() {
    if (this.pretext && !this.isCheckbox) {
      const input = this.template.querySelector(".vlocity-input");
      if (input) {
        input.classList.add("nds-not-empty", "nds-is-dirty");
      }
    }
    return this.pretext && !this.isCheckbox;
  }

  handleMaxLength() {
    if (this.maxLength && this.maxLength === this.inputValue.length) {
      this.warningMessage = this.messageWhenReachedMaxLength.replace(
        /\{0\}/g,
        this.maxLength
      );
    }
  }
}
