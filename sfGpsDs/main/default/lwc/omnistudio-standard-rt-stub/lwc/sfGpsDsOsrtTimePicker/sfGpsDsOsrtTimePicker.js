import { LightningElement, api, track } from "lwc";
import pubsub from "c/sfGpsDsOsrtPubsub";
import {
  isDate,
  isValidDate as isValid,
  WrapperComponentConstraints,
  lwcPropertyNameConversion
} from "c/sfGpsDsOsrtUtility";
import {
  unitName,
  determineMaxGranularity
} from "c/sfGpsDsOsrtVlocDayJSHelpers";
import dayjs from "c/sfGpsDsOsrtDayjs";
import { timePickerLabels as translatedLabels } from "c/sfGpsDsOsrtSalesforceUtils";

import sldsTemplate from "./timePicker_slds.html";
import ndsTemplate from "./timePicker_nds.html";

const ISOPattern =
  /^(?:(\d{4})-(\d\d)-(\d\d))?T?(\d\d):(\d\d):(\d\d).(\d{3})Z$/;

let optId = 0;

const availableOptions = ["min", "max", "value", "startTime", "endTime"];

/**
 * a11y constants
 */

const ARIA_CONTROLS = "aria-controls";
const ARIA_DESCRIBEDBY = "aria-describedby";
const ARIA_LABEL = "aria-label";
const ARIA_ACTIVEDESCENDANT = "aria-activedescendant";
const ARIA_INVALID = "aria-invalid";

export default class VlocityTimePicker extends LightningElement {
  @api theme = "slds";
  @api label;
  @api disabled;
  _required;
  @api get required() {
    return this._required;
  }
  set required(required) {
    this._required = required;
  }
  @api readOnly;
  @api tabIndex = "0";
  @api placeholder;
  @track hideIconVal;
  @track _localeFormatInvalidError;
  @track _messageWhenValueMissing;
  @track _messageWhenBadInput;
  @track _requiredLabel;
  _ariaLabel;
  @api get ariaLabel() {
    return this._ariaLabel || this.label;
  }
  set ariaLabel(value) {
    if (value) {
      this._ariaLabel = value;
    }
  }

  clockIconLabel = translatedLabels.cmpClockIconLabel;
  inputEle;
  aria_describedBy;
  aria_controls;
  aria_activedescendant;

  @api get localeFormatInvalidError() {
    return this._localeFormatInvalidError;
  }
  set localeFormatInvalidError(val) {
    if (val) {
      this._localeFormatInvalidError = val;
    } else {
      this._localeFormatInvalidError = translatedLabels.cmpLocaleFormatsInvalid;
    }
  }

  @api get messageWhenValueMissing() {
    return this._messageWhenValueMissing;
  }
  set messageWhenValueMissing(val) {
    if (val) {
      this._messageWhenValueMissing = val;
    } else {
      this._messageWhenValueMissing = translatedLabels.cmpFieldValueMissing;
    }
  }

  @api get messageWhenBadInput() {
    return this._messageWhenBadInput.replace(/\{0\}/g, this.format);
  }
  set messageWhenBadInput(val) {
    if (val) {
      this._messageWhenBadInput = val;
    } else {
      this._messageWhenBadInput = translatedLabels.cmpDateFieldNotValid;
    }
  }

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
  @api get messageWhenRangeUnderflow() {
    return this._messageWhenRangeUnderflow
      ? this.formatStringForDisplay(this._messageWhenRangeUnderflow)
      : "";
  }
  set messageWhenRangeUnderflow(val) {
    this._messageWhenRangeUnderflow = val;
  }
  _messageWhenRangeUnderflow = "Date is before allowed range.";
  @api get messageWhenRangeOverflow() {
    return this._messageWhenRangeOverflow
      ? this.formatStringForDisplay(this._messageWhenRangeOverflow)
      : "";
  }
  set messageWhenRangeOverflow(val) {
    this._messageWhenRangeOverflow = val;
  }
  _messageWhenRangeOverflow = "Date is after allowed range.";

  formatStringForDisplay(string) {
    return string.replace(/%[^%]+%/g, this.mergeFieldReplacer.bind(this));
  }

  mergeFieldReplacer(match) {
    let key = match.substr(1, match.length - 2);
    if (availableOptions.includes(key) && this[key]) {
      return this.formatInputValue(this[key]);
    }
    return match;
  }
  @api name;
  @api iconUrl;
  @api fieldLevelHelp;
  @api fieldLevelHelpPosition;
  @api hideAsterisk = false;
  @api hideIcon;
  formatGranularity = 0;
  set format(val) {
    this._format = val;
    if (this._format) {
      this.setInputValue();
    }
    this.formatGranularity = determineMaxGranularity(this._format);
  }
  @api get format() {
    return this._format || "HH:mm";
  }

  @api get interval() {
    return this._interval || 15;
  }
  set interval(val) {
    this._interval = Number.isNaN(val)
      ? 15
      : typeof val === "string"
        ? parseInt(val, 10)
        : val;
  }

  @api get outputFormat() {
    return this._outputFormat || "HH:mm";
  }
  set outputFormat(val) {
    let oldDate = this.valueAsDate;
    this._outputFormat = val;
    if (this._outputFormat) {
      this.setInputValue();
    }
  }

  @api outputType = "string";
  @track _displayValue = "";
  @api get displayValue() {
    return this._displayValue;
  }
  @track isError;
  @track options;
  @track _interval;
  @track _format;
  _prevValueSetArg;
  @track _outputFormat;
  @track _currentSelectedIndex;
  @track _isOpen = false;

  @api localeFormat;
  @api min;
  @api max;
  @track _inputValue = "";

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
          labelEles[0].style.display = "grid";
        }
      }
    });
  }

  get _min() {
    return this.parseValue(this.min);
  }
  get _max() {
    return this.parseValue(this.max);
  }

  get startTime() {
    if (!this._startTime) {
      this._startTime = this._min || dayjs().startOf("day").toDate();
    }
    return this._startTime;
  }
  get endTime() {
    if (!this._endTime) {
      this._endTime = this._max || dayjs().endOf("day").toDate();
    }
    return this._endTime;
  }

  _eventListeners = [];
  _connected = false;

  firstRender = true;

  @track errorMessage;

  get inputElement() {
    return this.template.querySelector("input");
  }

  @api get _constraint() {
    if (!this._constraintApi) {
      const overrides = {
        badInput: () => {
          return this._displayValue == null || this._displayValue === ""
            ? false
            : !isValid(this.parseInputTimetoDate(this._displayValue));
        },
        rangeUnderflow: () => {
          return (
            this.startTime &&
            this.min &&
            dayjs(this.parseInputTimetoDate(this._displayValue)).isBefore(
              this._min
            )
          );
        },
        rangeOverflow: () => {
          return (
            this.endTime &&
            this.max &&
            dayjs(this.parseInputTimetoDate(this._displayValue)).isAfter(
              this._max
            )
          );
        },
        valueMissing: () =>
          this._required &&
          !this._displayValue &&
          this.inputElement.validity.valueMissing
      };
      this._constraintApi = new WrapperComponentConstraints(
        () => this,
        () => this.inputElement,
        overrides,
        this.theme
      );
    }
    return this._constraintApi;
  }

  @api get validity() {
    if (!this || !this._constraint) return null;
    let out = {};
    [
      "customError",
      "badInput",
      "patternMismatch",
      "rangeOverflow",
      "rangeUnderflow",
      "stepMismatch",
      "tooLong",
      "tooShort",
      "typeMismatch",
      "valueMissing",
      "valid"
    ].forEach(function (constraintKey) {
      out[constraintKey] = !!this._constraint.validity[constraintKey];
    }, this);
    return out;
  }

  @api checkValidity() {
    var valid = !this._connected || this._constraint.checkValidity();
    return valid;
  }

  @api setCustomValidity(e) {
    this._constraint.setCustomValidity(e);
    if (!this.firstRender && e) this.showHelpMessageIfInvalid();
  }

  @api showHelpMessageIfInvalid() {
    var valid = this.reportValidity();
    return valid;
  }

  @api reportValidity() {
    var valid =
      !this._connected ||
      this._constraint.reportValidity((e) => {
        this.errorMessage = e;
        return true;
      });
    this.isError = !valid;
    return valid;
  }

  get dateSource() {
    if (!this._dateSource) {
      if (this._min) {
        this._dateSource = this._min;
      } else {
        this._dateSource = new Date();
      }
    }
    if (
      (this._dateSource &&
        isDate(this._dateSource) &&
        this._dateSource.toString() === "Invalid Date") ||
      this._dateSource == null
    ) {
      // async because this is a non-breaking issue. runtime should continue
      // eslint-disable-next-line @lwc/lwc/no-async-operation
      setTimeout(() => {
        throw Error(
          'Minimum Time: "' +
            this.min +
            '" cannot be parsed using ISO format or Date Format(s) "' +
            this.format +
            '" or "' +
            this.outputFormat +
            '".'
        );
      }, 0);
      return new Date();
    }
    return this._dateSource;
  }

  @api get valueAsDate() {
    let out = this._value ? this._value : this._displayValue;
    if (out) {
      out = this.parseInputTimetoDate(this._displayValue);
      return out;
    }
    return null;
  }

  set value(value) {
    this._value = value;
    this.setInputValue();
  }

  @api
  get value() {
    let out = this.valueAsDate;
    if (out) {
      if (this.outputType !== "date") {
        out = dayjs(out).format(this.outputFormat);
      }
      return out;
    }
    return "";
  }

  @api
  setValue(value) {
    if (value) {
      this._displayValue = this.formatInputTime(value, true);
      if (this._displayValue) {
        this.setSelectedOption();
      }
    } else {
      this._displayValue = null;
    }

    if (this.inputElement) {
      this.inputElement.value = this._displayValue;
    }
  }

  setInputValue() {
    if (this._format && this._value) {
      this._displayValue = this.formatInputTime(this._value, true);
      if (this._displayValue) {
        this.setSelectedOption();
      }
    }

    if (!this._value) {
      this._displayValue = null;
    }

    if (this.inputElement) {
      this.inputElement.value = this._displayValue;
    }
  }

  parseInputTimetoDate(value) {
    let date;
    if (value == null || value === "") {
      date = null;
    } else if (isDate(value)) {
      date = value;
    } else {
      try {
        const day = dayjs(value, this.format);
        if (day.format(this.format) === value) {
          date = day.toDate();
        } else {
          date = null;
        }
      } catch (e) {
        console.error(e);
      }
    }
    if (date != null && date instanceof Date) {
      date.setFullYear(
        this.dateSource.getFullYear(),
        this.dateSource.getMonth(),
        this.dateSource.getDate()
      );
    }
    if (
      this._min &&
      date < this._min &&
      dayjs(date).isSame(this._min, unitName(this.formatGranularity))
    ) {
      date = this._min;
    }
    if (
      this._max &&
      date > this._max &&
      dayjs(date).isSame(this._max, unitName(this.formatGranularity))
    ) {
      date = this._max;
    }
    return date;
  }

  dateValueParser(val, isValue) {
    if (isDate(val) || val instanceof Number) {
      let result = new Date(val);
      if (isValue) {
        this._dateSource = result;
      }
      return result;
    }
    let result = val.match(ISOPattern);
    if (result) {
      result = new Date(val);
      if (result.toString() === "Invalid Date") {
        // manually creates an ISO format date string to be formatted as `val` would only be an invalid date if the
        // format is not a standard ISO format in which case additional formatting is needed
        result = new Date("1970-01-01T" + val);
        if (
          result.toString() !== "Invalid Date" &&
          result.toISOString() === "1970-01-01T" + val
        ) {
          return result.getTime() + result.getTimezoneOffset() * 60000;
        }
      } else if (result.toISOString() === val) {
        if (isValue) {
          this._dateSource = result;
        }
        return result;
      }
    }
    result = dayjs(val, this.outputFormat);
    if (val === result.format(this.outputFormat)) {
      return result.toDate();
    }
    result = dayjs(val, this.format);
    if (val === result.format(this.format)) {
      return result.toDate();
    }
    if (isValue) {
      this.lastInvalid = val;
    }
    return null;
  }

  parseValue(value, isValue) {
    let date;
    try {
      if (value == null || value === "") {
        date = null;
      } else {
        date = this.dateValueParser(value, isValue);
      }
    } catch (e) {
      console.error(e);
    }
    return date;
  }

  formatInputValue(date) {
    if (isValid(date)) {
      return dayjs(date).format(this.format);
    }
    return "";
  }

  formatInputTime(value, isValue) {
    return this.formatInputValue(this.parseValue(value, isValue));
  }

  render() {
    if (this.theme === "nds") {
      return ndsTemplate;
    }
    return sldsTemplate;
  }

  renderedCallback() {
    if (!this.inputEle) {
      this.inputEle = this.template.querySelector("input");
    }
    if (this.hideIconVal) {
      this.inputEle.style.paddingRight = 0;
    }
    if (this.inputEle && this.firstRender) {
      ["blur", "focus", "change"].forEach((event) => {
        var eventCallback = () => {
          this.dispatchEvent(
            new CustomEvent(event, {
              bubbles: true,
              composed: true
            })
          );
        };
        this.registerListener(this.inputEle, event, eventCallback);
      }, this);
      this.firstRender = false;
    }
    if (this.theme === "nds") {
      if (this.inputEle.value)
        this.inputEle.classList.add("nds-not-empty", "nds-is-dirty");
      else this.inputEle.classList.remove("nds-not-empty", "nds-is-dirty");
    }
    if (this.lastInvalid) {
      let tmp = this.dateValueParser(this.lastInvalid);
      if (tmp && this.valueAsDate && this.valueAsDate !== tmp) {
        this.assignDate(tmp);
      }
      delete this.lastInvalid;
    }
    this.synchronizeA11y();
  }

  registerListener(target, eventType, callback, options) {
    target.addEventListener(eventType, callback, options);
    this._eventListeners.push({
      target: target,
      type: eventType,
      callback: callback,
      options: options
    });
  }

  removeRetisteredListeners() {
    return this._eventListeners.reduce(function (out, entry) {
      return (
        out &&
        entry.target.removeEventListener(
          entry.type,
          entry.callback,
          entry.options
        )
      );
    }, true);
  }

  get errorClass() {
    return `${this.theme}-form-element ${
      this.theme === "nds" ? "nds-form-container" : ""
    } ${this.isError ? `${this.theme}-has-error` : ``}`;
  }

  get isAriaInvalid() {
    return this.isError ? "true" : "false";
  }

  showLookup(event) {
    if (this.readOnly) {
      return;
    }
    let inputElm = this.template.querySelector("input");
    if (event.type === "mousedown") {
      this.showDropdown();
    } else if (event.type === "blur") {
      if (inputElm.getAttribute("scroll-click") === null) {
        inputElm.removeAttribute("scroll-click");
        this.hideDropdown();
        return;
      } else if (
        inputElm.getAttribute("scroll-click") === "scroll" &&
        this._inputValue === ""
      ) {
        inputElm.removeAttribute("scroll-click");
        inputElm.focus();
        return;
      }

      this.onInputChange(event);
      inputElm.removeAttribute("scroll-click");
      if (this._inputValue !== event.currentTarget.value) {
        this._inputValue = event.currentTarget.value;
        this.handleComponentLosesFocus(event);
      }
    }
  }

  handleComponentLosesFocus(event) {
    if (this.readOnly) {
      return;
    }
    if (event.type === "blur") {
      this.hideDropdown();
      const tooltip = this.template.querySelector("[data-field-level-help]");
      if (tooltip) {
        tooltip.closeTooltip();
      }
    }
  }

  scrollerClickOnList() {
    this.template.querySelector("input").setAttribute("scroll-click", "scroll");
  }

  showDropdown() {
    this.setOptions();
    let ddele = this.template.querySelector(
      `.${this.theme}-dropdown-trigger_click`
    );

    this._isOpen = true;
    ddele.classList.toggle(`${this.theme}-is-open`);
    ddele.setAttribute("aria-expanded", "true");
    Promise.resolve().then(() => {
      this.clearFocus();
      this.clearSelected();
      let selEle = this.template.querySelector("[data-selected='true']");
      if (selEle) {
        selEle.classList.add(`${this.theme}-is-selected`);
        selEle.classList.add(`${this.theme}-has-focus`);
        this._currentSelectedIndex = parseInt(selEle.dataset.index, 10);
        this.aria_activedescendant = selEle.getAttribute("id");
        selEle.setAttribute("aria-selected", true);
      } else {
        this._currentSelectedIndex = 0;
        let ele = this.template.querySelector(
          `[data-index='${this._currentSelectedIndex}']`
        );
        if (ele) {
          ele.classList.add(`${this.theme}-has-focus`);
          this.aria_activedescendant = ele.getAttribute("id");
          ele.setAttribute("aria-selected", true);
        }
      }
      this.scrollByIndex();
      this.synchronizeA11y();
    });
  }

  hideDropdown() {
    let ddele = this.template.querySelector(
      `.${this.theme}-dropdown-trigger_click`
    );
    this._isOpen = false;
    ddele.classList.remove(`${this.theme}-is-open`);
    ddele.setAttribute("aria-expanded", "false");
    if (!this.firstRender) this.showHelpMessageIfInvalid();
  }

  onInputChange(event) {
    this._displayValue = event.currentTarget.value;
    this.setSelectedOption();
    this.formatInputTime(this._displayValue, true);
  }

  assignDate(value) {
    this._value = value;
    this.setInputValue();
    this.setSelectedOption();
    this.setTime();
  }

  selectOption(event) {
    this._displayValue = event.currentTarget.dataset.val;
    this.setSelectedOption();
    this.setTime();
  }

  setTime() {
    if (this && this.name) {
      pubsub.fire(this.name, "valuechange", {
        name: this.name,
        value: this._displayValue
      });
    }
    this.dispatchEvent(
      new CustomEvent("change", {
        bubbles: true,
        composed: true
      })
    );
    this.hideDropdown();
  }

  setSelectedOption() {
    let opts = Object.assign([], this.options);
    this.options = opts.map((item) => {
      item.selected = dayjs(this.parseInputTimetoDate(item.value)).isSame(
        this.parseInputTimetoDate(this._displayValue)
      );
      return item;
    });
  }

  connectedCallback() {
    let localeFormat;
    if (this.localeFormat) {
      localeFormat = this.localeFormat;
    } else if (translatedLabels.cmpDayJsLocaleFormats) {
      localeFormat = translatedLabels.cmpDayJsLocaleFormats;
    }
    if (localeFormat) {
      try {
        let localeObj = JSON.parse(localeFormat);
        // add locale object
        dayjs.locale(localeObj, null, true);
        // switch to locale
        dayjs.locale(localeObj.name);
      } catch (e) {
        throw new Error(
          this.localeFormatInvalidError
            .replace("${1}", "timePicker")
            .replace("${2}", localeFormat)
        );
      }
    }
    this.hideIconVal = this.hideIcon !== "false";
    this._connected = true;
  }

  setOptions() {
    let currentTime = new Date(this.startTime);
    let opts = [];
    let formattedVal;
    while (!dayjs(this.endTime).isBefore(currentTime)) {
      formattedVal = this.formatInputTime(currentTime);
      if (!opts.includes(formattedVal)) {
        opts.push(formattedVal);
      }
      currentTime.setMinutes(currentTime.getMinutes() + this.interval);
    }
    this.options = opts.map((item) => {
      return {
        id: `opt-${optId++}`,
        value: item,
        selected: dayjs(this.parseInputTimetoDate(item)).isSame(
          this.parseInputTimetoDate(this._displayValue)
        )
      };
    });
  }

  disconnectedCallback() {
    this._connected = false;
    this.removeRetisteredListeners();
  }

  @api
  focus() {
    this.template.querySelector("input").focus();
  }

  //Keyboard event
  handleKeyboardEvent(event) {
    switch (event.keyCode) {
      case 38: //up arrow
        this.handleArrow(true);
        break;
      case 40: //down arrow
        if (!this._isOpen) {
          this.showDropdown();
        }
        this.handleArrow(false);
        break;
      case 13:
        if (this._isOpen) {
          this.handleEnter();
        } else {
          this.showDropdown();
        }
        break;
      default:
    }
  }

  handleKeyUp(event) {
    this._displayValue = event.target.value;
  }

  handleEnter() {
    let ele = this.template.querySelector(
      `[data-index='${this._currentSelectedIndex}']`
    );
    this._displayValue = ele.dataset.val;
    this.aria_activedescendant = undefined;
    this.setSelectedOption();
    this.setTime();
    this.formatInputTime(this._displayValue, true);
    this.hideDropdown();
    this.synchronizeA11y();
  }

  handleArrow(isUp) {
    let totalOpt = this.options.length;
    this.clearFocus();
    this._currentSelectedIndex =
      typeof this._currentSelectedIndex === "undefined"
        ? 0
        : this._currentSelectedIndex + (isUp ? -1 : 1);
    if (this._currentSelectedIndex <= -1) {
      this._currentSelectedIndex = totalOpt - 1;
    } else if (this._currentSelectedIndex >= totalOpt) {
      this._currentSelectedIndex = 0;
    }
    this.scrollByIndex(isUp);
    let ele = this.template.querySelector(
      `[data-index='${this._currentSelectedIndex}']`
    );
    if (ele) {
      ele.classList.add(`${this.theme}-has-focus`);
      ele.setAttribute("aria-selected", true);
      this.aria_activedescendant = ele.getAttribute("id");
    }
    this.synchronizeA11y();
  }

  scrollByIndex(isUp) {
    let ul = this.template.querySelector("ul");
    if (!ul) {
      return;
    }
    if (this._currentSelectedIndex === 0) {
      ul.scrollTop = 0;
    } else if (this._currentSelectedIndex === this.options.length - 1) {
      ul.scrollTop = this._currentSelectedIndex * 37;
    } else if (this._currentSelectedIndex > (isUp ? 3 : 4)) {
      ul.scrollTop = (this._currentSelectedIndex - 4) * 37;
    }
  }

  clearFocus() {
    let elements = this.template.querySelectorAll("[data-timepicker-option]");
    this.aria_activedescendant = undefined;
    elements.forEach((ele) => {
      if (ele.classList.contains(`${this.theme}-has-focus`))
        ele.classList.remove(`${this.theme}-has-focus`);
      ele.setAttribute("aria-selected", false);
    });
  }

  clearSelected() {
    let elements = this.template.querySelectorAll(`.${this.theme}-is-selected`);
    elements.forEach((ele) => {
      ele.classList.remove(`${this.theme}-is-selected`);
    });
  }

  /**
   * set Aria Attributes of the input element
   */
  synchronizeA11y() {
    this.inputEle = this.inputEle
      ? this.inputEle
      : this.template.querySelector("input");
    if (!this.inputEle) {
      return;
    }
    this.aria_describedBy = this.aria_describedBy
      ? this.aria_describedBy
      : this.template
          .querySelector("[data-timepicker-error-block]")
          ?.getAttribute("id");
    this.aria_controls = this.aria_controls
      ? this.aria_controls
      : this.template.querySelector("ul")?.getAttribute("id");

    this.setElementAttribute(this.inputEle, {
      [ARIA_DESCRIBEDBY]: this.aria_describedBy,
      [ARIA_CONTROLS]: this.aria_controls,
      [ARIA_LABEL]: this.ariaLabel
        ? this.required
          ? `*${this.ariaLabel}`
          : this.ariaLabel
        : undefined,
      [ARIA_INVALID]: this.isAriaInvalid,
      [ARIA_ACTIVEDESCENDANT]: this.aria_activedescendant
    });
  }

  setElementAttribute(element, attributeValues) {
    if (!element) {
      return;
    }
    const attr = Object.keys(attributeValues);
    attr.forEach((attribute) => {
      if (attributeValues[attribute])
        element.setAttribute(attribute, attributeValues[attribute]);
      else element.removeAttribute(attribute);
    });
  }
}
