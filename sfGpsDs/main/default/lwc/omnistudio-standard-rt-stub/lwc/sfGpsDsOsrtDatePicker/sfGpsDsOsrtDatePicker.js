import { LightningElement, api, track } from "lwc";
import sldsTemplate from "./datePicker_slds.html";
import ndsTemplate from "./datePicker_nds.html";
import pubsub from "c/sfGpsDsOsrtPubsub";
import {
  isDate,
  isMobile,
  mobileDateFormat,
  WrapperComponentConstraints,
  lwcPropertyNameConversion
} from "c/sfGpsDsOsrtUtility";
import {
  unitName,
  determineMaxGranularity
} from "c/sfGpsDsOsrtVlocDayJSHelpers";
import dayjs from "c/sfGpsDsOsrtDayjs";
import { isEqual } from "c/sfGpsDsOsrtLodash";
import {
  datePickerLabels as translatedLabels,
  shortDateFormat
} from "c/sfGpsDsOsrtSalesforceUtils";
import { delay } from "c/sfGpsDsOsrtAsyncUtils";

const dateFormat = shortDateFormat
  ? shortDateFormat.toUpperCase()
  : "MM/dd/yyyy";
function isValidDate(obj) {
  return isDate(obj) && !isNaN(obj.getTime());
}

const debounce = (fn, time) => {
  let timeout;

  return function () {
    const functionCall = () => fn.apply(this, arguments);

    clearTimeout(timeout);
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    timeout = setTimeout(functionCall, time);

    return timeout;
  };
};

const getFirstMondayDate = (date) => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
};

const cancelDebounce = function (timeout) {
  clearTimeout(timeout);
};

const availableOptions = ["min", "max", "value"];

const ISOPattern = /^(\d{4})-(\d\d)-(\d\d)(?:T(\d\d):(\d\d):(\d\d).(\d{3})Z)?$/;
const UTCPattern =
  /\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2]\d|3[0-1])T(?:[0-1]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d+|)(?:Z|(?:\+|-)(?:\d{2}):?(?:\d{2}))/;
const thisDate = new Date();
const currentYear = thisDate.getFullYear();
const currentMonth = thisDate.getMonth();
const currentDay = thisDate.getDate();
const currentDayClass = ".dayId" + currentDay;

const MAX_WEEKS_IN_MONTH = 6;
const NUM_DAYS_IN_DEC = 31;
const NUM_DAYS_IN_WEEK = 7;
const NUM_OF_DAYS_FROM_MONDAY_TO_SATURDAY = 5;

export default class VlocityDatePicker extends LightningElement {
  @track years = [];
  @api theme = "slds";
  @track chosenYear;
  @track _displayValue = "";
  @api get displayValue() {
    return this._displayValue;
  }
  @track DayArray = [{}];
  @track built = false;
  @track buttonDisabled;
  @api placeholder;
  @track firstRender = true;
  _required;
  @api get required() {
    return this._required;
  }
  set required(required) {
    this._required = required;
    this._ariaLabel = this._ariaLabel || this.label;
    this._ariaLabel = this._required ? "*" + this._ariaLabel : this._ariaLabel;
  }
  @api tabIndex = "0";
  _readonly;
  @api get readOnly() {
    return this._readonly;
  }
  set readOnly(readOnly) {
    this._readonly = readOnly;
    this.buttonDisabled =
      this._readonly || this.disabled ? "disabled" : undefined;
  }
  @track type = "text";
  @track selectedYear;
  @api name;
  @track _ariaLabel;
  @api get ariaLabel() {
    return this._ariaLabel;
  }
  set ariaLabel(ariaLabel) {
    this._ariaLabel = ariaLabel || this.label;
  }
  @api label;
  _disabled;
  @api get disabled() {
    return this._disabled;
  }
  set disabled(disabled) {
    this._disabled = disabled;
    this.buttonDisabled =
      this._readonly || this.disabled ? "disabled" : undefined;
  }
  @api position;
  @api size;
  @api mask;
  @api iconUrl;
  @api fieldLevelHelp;
  @api fieldLevelHelpPosition;
  @api localeFormat;
  @track _min;
  @track _max;
  @api hideAsterisk = false;
  @api hideIcon = "false"; // defaulted to "false" so icon is not hidden
  @track hideIconVal;
  outputGranularity = 8;
  @track _prevMonthLabel = "";
  @track _nextMonthLabel = "";
  @track _todayLabel = "";
  @track _requiredLabel;
  @track _localeFormatInvalidError = "";
  @track _selectDateLabel;
  @track _pickYearLabel;
  @track _messageWhenValueMissing;
  @track _messageWhenBadInput = "";
  @track _dataSelectEvent = "";

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

  @api get selectDateLabel() {
    return this._selectDateLabel;
  }
  set selectDateLabel(val) {
    if (val) {
      this._selectDateLabel = val;
    } else {
      this._selectDateLabel = translatedLabels.cmpSelectDate;
    }
  }

  @api get pickYearLabel() {
    return this._pickYearLabel;
  }
  set pickYearLabel(val) {
    if (val) {
      this._pickYearLabel = val;
    } else {
      this._pickYearLabel = translatedLabels.cmpPickYr;
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
  @api get prevMonthLabel() {
    return this._prevMonthLabel;
  }
  set prevMonthLabel(val) {
    if (val) {
      this._prevMonthLabel = val;
    } else {
      this._prevMonthLabel = translatedLabels.cmpPrevMonth;
    }
  }
  @api get nextMonthLabel() {
    return this._nextMonthLabel;
  }
  set nextMonthLabel(val) {
    if (val) {
      this._nextMonthLabel = val;
    } else {
      this._nextMonthLabel = translatedLabels.cmpNextMonth;
    }
  }
  @api get todayLabel() {
    return this._todayLabel;
  }
  set todayLabel(val) {
    if (val) {
      this._todayLabel = val;
    } else {
      this._todayLabel = translatedLabels.cmpToday;
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
  @api get outputType() {
    return this._outputType || "string";
  }
  set outputType(val) {
    let oldDate = this.valueAsDate;
    this._outputType = val;
    this.setValue(this.formatValue(oldDate));
    if (this._outputType !== "string") {
      this.outputGranularity = 8;
    } else {
      this.outputGranularity = determineMaxGranularity(this.dateOutputFormat);
    }
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

  @api get format() {
    return this.dateFormat || dateFormat || "YYYY-MM-DD";
  }
  formatGranularity = 0;
  set format(val) {
    let oldDate = this.valueAsDate;
    this.dateFormat = val ? val : dateFormat ? dateFormat : "YYYY-MM-DD";
    this.setValue(this.formatValue(oldDate));
    this.formatGranularity = determineMaxGranularity(this.dateFormat);
    this.setMinDate();
    this.setMaxDate();
    this.rebuildYearsArray();
  }
  @api get outputFormat() {
    return this.dateOutputFormat || dateFormat.toUpperCase() || "YYYY-MM-DD";
  }
  set outputFormat(val) {
    let oldDate = this.valueAsDate;
    this.dateOutputFormat = val ? val : dateFormat ? dateFormat : "YYYY-MM-DD";
    this.setValue(this.formatValue(oldDate));
    if (this._outputType === "string") {
      this.outputGranularity = determineMaxGranularity(this.dateOutputFormat);
    }
    this.setMinDate();
    this.setMaxDate();
    this.rebuildYearsArray();
  }

  _isMobile = isMobile();
  _connected = false;
  dateOutputFormat;
  isMinMaxDate = false;
  chosenDayClass = "";
  yearChosen;
  onInputblur;
  days;
  day;
  @track month = "";
  refreshCalendar = false;
  cellIndex = "";
  setFocus = false;
  _focusDayOfMonth = null;
  months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  get selectedMonth() {
    return this.months[this.month];
  }

  @track daysTitle = [
    {
      name: "Sun"
    },
    {
      name: "Mon"
    },
    {
      name: "Tue"
    },
    {
      name: "Wed"
    },
    {
      name: "Thu"
    },
    {
      name: "Fri"
    },
    {
      name: "Sat"
    }
  ];

  @api get value() {
    return this._value;
  }
  set value(val) {
    this.setValue(val);
  }
  @api get max() {
    return this._max;
  }
  set max(val) {
    this._max = val;
    this.setMaxDate();
    this.rebuildYearsArray();
  }
  @api get min() {
    return this._min;
  }
  set min(val) {
    this._min = val;
    this.setMinDate();
    this.rebuildYearsArray();
  }

  setMinDate() {
    this.minDate = this._min ? this.parseValue(this._min) : null;
  }

  setMaxDate() {
    this.maxDate = this._max ? this.parseValue(this._max) : null;
  }

  rebuildYearsArray = debounce(this.rebuildYearsArrayAux, 10);
  rebuildYearsArrayAux() {
    var centBound;
    this.chosenYear = this.chosenYear ? this.chosenYear : currentYear;
    let minYear =
      (this.minDate && isDate(this.minDate) && this.minDate.getFullYear()) ||
      null;
    centBound = this.chosenYear - 100;
    minYear =
      minYear === undefined || minYear === null || minYear < centBound
        ? centBound
        : minYear;
    let maxYear =
      (this.maxDate && isDate(this.maxDate) && this.maxDate.getFullYear()) ||
      null;
    centBound = this.chosenYear + 100;
    maxYear =
      maxYear === undefined || maxYear === null || maxYear > centBound
        ? centBound
        : maxYear;
    this.years = [];

    let minimumYearForDropdown = minYear;
    const firstMonday = getFirstMondayDate(new Date("January 1, " + minYear));

    if (this.minDate && firstMonday) {
      const firstMondayToEndOfDec = NUM_DAYS_IN_DEC - firstMonday.getDate();
      const dayOfFirstJan = NUM_DAYS_IN_WEEK - firstMondayToEndOfDec;
      const firstMondayInJan = new Date(`January ${dayOfFirstJan}, ${minYear}`);

      if (
        this.minDate.getMonth() === 0 &&
        (firstMonday.getMonth() === 11 || firstMonday.getMonth() === 0) &&
        firstMondayInJan.getDate() + NUM_OF_DAYS_FROM_MONDAY_TO_SATURDAY >
          this.minDate.getDate() &&
        firstMondayInJan.getDate() < NUM_DAYS_IN_WEEK
      ) {
        minimumYearForDropdown = minYear - 1;
      }
    }

    for (let i = minimumYearForDropdown; i <= maxYear; i++) {
      this.years.push({
        value: i
      });
    }
    this.refreshCalendar = true;
  }

  @api setValue(val) {
    val = this.parseValue(val, true);
    if (this.minDate && val < this.minDate) {
      if (dayjs(val).isSame(this.minDate, unitName(this.outputGranularity))) {
        val = this.minDate;
      }
    }
    if (this.maxDate && val > this.minDate) {
      if (dayjs(val).isSame(this.maxDate, unitName(this.outputGranularity))) {
        val = this.maxDate;
      }
    }
    this._value = this.formatValue(val);
    this.updateDisplayValue();
  }

  updateDisplayValue() {
    let val = this.parseValue(this._value, true);
    let inputVal = val ? this.formatCheck(val) : val;
    this._displayValue = inputVal;
    if (this.inputElement) {
      this.inputElement.value = inputVal;
    }
  }

  @api
  get valueAsDate() {
    return this.parseValue(this.value, true);
  }

  parseValue(value, forValue) {
    let date;
    try {
      if (value == null || value === "") {
        date = null;
      } else {
        date = this.dateValueParser(value, forValue);
      }
    } catch (e) {
      console.error(e);
    }
    return date;
  }

  formatValue(date) {
    if (isValidDate(date)) {
      if (this.outputType === "string") {
        return dayjs(date).format(this.outputFormat);
      }
      return date;
    }
    return null;
  }

  parseInputValue(inputValue) {
    if (inputValue == null || inputValue === "") {
      return null;
    }
    let parseFormat;
    if (this._isMobile) {
      parseFormat = mobileDateFormat;
    } else {
      parseFormat = this.format;
    }
    const day = dayjs(inputValue, parseFormat);
    let date = day.toDate();
    if (isValidDate(date) && day.format(parseFormat) === inputValue) {
      if (
        this.minDate &&
        date < this.minDate &&
        dayjs(date).isSame(this.minDate, unitName(this.formatGranularity))
      ) {
        date = this.minDate;
      }
      if (
        this.maxDate &&
        date > this.minDate &&
        dayjs(date).isSame(this.maxDate, unitName(this.formatGranularity))
      ) {
        date = this.maxDate;
      }
      return date;
    }
    return null;
  }

  formatInputValue(date) {
    if (isValidDate(date)) {
      if (this._isMobile) {
        return dayjs(date).format(mobileDateFormat);
      }
      return dayjs(date).format(this.format);
    }
    return "";
  }

  @api valuesAreEqual(a, b) {
    let A = this.dateValueParser(a);
    let B = this.dateValueParser(b);
    return isEqual(A, B);
  }

  dateValueParser(val, forValue) {
    if (isDate(val) || val instanceof Number) {
      return new Date(val);
    }
    let result = val.match(ISOPattern);
    if (result) {
      result = new Date(val);
      if (result.toISOString() === val) {
        return result;
      }
    }
    if (this._isMobile && dayjs(val, mobileDateFormat).isValid()) {
      result = dayjs(val, mobileDateFormat);
      return result.toDate();
      //eslint-disable-next-line no-else-return
    } else {
      result = dayjs(val, this.outputFormat);
    }
    if (val === result.format(this.outputFormat)) {
      return result.toDate();
    }
    result = dayjs(val, this.format);
    if (val === result.format(this.format)) {
      return result.toDate();
    }
    // UTC format with Timezone offset
    result = val.match(UTCPattern);
    if (result) {
      result = new Date(val);
      return result;
    }
    if (forValue) {
      this.lastInvalid = val;
    }
    return null;
  }

  @track isError = false;
  @track errorMessage;
  @api get messageWhenRangeUnderflow() {
    return this._messageWhenRangeUnderflow
      ? this.formatStringForDisplay(this._messageWhenRangeUnderflow)
      : "";
  }
  set messageWhenRangeUnderflow(val) {
    this._messageWhenRangeUnderflow = val;
  }
  _messageWhenRangeUnderflow = translatedLabels.cmpRangeUnderflow;
  @api get messageWhenRangeOverflow() {
    return this._messageWhenRangeOverflow
      ? this.formatStringForDisplay(this._messageWhenRangeOverflow)
      : "";
  }
  set messageWhenRangeOverflow(val) {
    this._messageWhenRangeOverflow = val;
  }
  _messageWhenRangeOverflow = translatedLabels.cmpRangeOverflow;

  formatStringForDisplay(string) {
    return string.replace(/%[^%]+%/g, this.mergeFieldReplacer.bind(this));
  }

  mergeFieldReplacer(match) {
    let key = match.substr(1, match.length - 2);
    if (availableOptions.includes(key) && this[key]) {
      return this.formatInputValue(this.parseValue(this[key]));
    }
    return match;
  }

  render() {
    if (this.theme === "nds") {
      return ndsTemplate;
    }
    return sldsTemplate;
  }

  translatedLabels = {};
  //
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
        // update months
        this.months = localeObj.months ? localeObj.months : this.months;
        // update titles for days of the week
        if (localeObj.weekdaysShort) {
          this.daysTitle = localeObj.weekdaysShort.map((day) => {
            return { name: day };
          });
        }
        // add locale object
        dayjs.locale(localeObj, null, true);
        // switch to locale
        dayjs.locale(localeObj.name);
      } catch (e) {
        throw new Error(
          this._localeFormatInvalidError
            .replace("${1}", "datePicker")
            .replace("${2}", localeFormat)
        );
      }
    }
    this.hideIconVal = this.hideIcon !== "false";
    this.rebuildYearsArray();
    this.template.addEventListener("click", (e) => {
      this.clickHandler(e);
    });
    if (this._isMobile) {
      this.type = "date";
    } else {
      this.type = "text";
    }
    this.processors = {};

    this.processors.parseModel = this.parseValue;
    this.processors.formatDisplay = this.formatInputValue;
    this.processors.parseDisplay = this.parseInputValue;
    this.processors.formatModel = this.formatValue;

    this._connected = true;
    this.translatedLabels = translatedLabels;
  }

  renderedCallback() {
    const input = this.inputElement;
    if (this.hideIconVal) {
      input.style.paddingRight = 0;
    }
    if (input && this.firstRender) {
      this.handleReadOnlyCalenderOpenInMobile();
      ["input", "blur", "focus", "change"].forEach((event) => {
        input.addEventListener(event, (e) => {
          if (event === "change") {
            // on mobile we dont have keyup events that call's the selectDate to set the date, so we set the date on change of the element
            if (this._isMobile) {
              this.selectDate(e);
              return;
            }
            pubsub.fire(this.name, "valuechange", {
              name: this.name,
              value: this._value
            });
          }
          if (
            event === "blur" &&
            !this._displayValue &&
            !this.dropdownTrigger.classList.contains(`${this.theme}-is-open`)
          ) {
            this.displayToday();
          }
          this.dispatchEvent(
            new CustomEvent(event, {
              bubbles: true,
              composed: true
            })
          );
        });
      });
      if (!this._displayValue) {
        this.displayToday();
      }
    }
    if (this.theme === "nds") {
      if (input.value) input.classList.add("nds-not-empty", "nds-is-dirty");
      else input.classList.remove("nds-not-empty", "nds-is-dirty");
    }
    if (!this.firstRender && this.lastInvalid) {
      let tmp = this.dateValueParser(this.lastInvalid);
      if (tmp && this.valueAsDate !== tmp) {
        this.assignDate(tmp);
      }
      delete this.lastInvalid;
    }
    if (!this.dropdownTrigger) {
      this.dropdownTrigger = this.template.querySelector(
        `.${this.theme}-dropdown-trigger_click`
      );
    }
    this.firstRender = false;
  }

  displayToday() {
    this.chosenYear = currentYear;
    this.selectedYear = currentYear;
    this.chosenMonth = this.month = currentMonth;
    this.day = null;
    this.refreshCalendar = true;
  }

  formatCheck(inputVal) {
    let _displayValue = this.formatInputValue(inputVal);
    this.chosenYear = dayjs(inputVal).year();
    this.month = this.chosenMonth = dayjs(inputVal).month();
    this.day = dayjs(inputVal).date();
    this.selectedYear = this.chosenYear;
    this.refreshCalendar = true;
    return _displayValue;
  }

  selectDate(event) {
    if (
      event.target &&
      !event.target.classList.contains(`${this.theme}-disabled-text`)
    ) {
      this._dataSelectEvent = "keydown";
      this.removeClassActive();
      let date, displayDate;
      if (this._isMobile) {
        // setting event target value if its on mobile
        date = event.target.value && event.target.value.split("-");
        displayDate =
          date && new Date(date[0], parseInt(date[1], 10) - 1, date[2]);
      } else {
        let yr = this.template.querySelector("select").value;
        let mo = this.month;
        let da = event.target.textContent;
        if (event.target.parentElement.classList.contains("prev-month")) {
          mo--;
        } else if (
          event.target.parentElement.classList.contains("next-month")
        ) {
          mo++;
        }

        displayDate = new Date(yr, mo, da);
        this.chosenMonth = displayDate.getMonth();
        this.chosenYear = displayDate.getYear();
      }
      this.assignDate(displayDate);
      this.hideCalendar();
    }
  }

  onDateEnter(event) {
    if (
      event.target &&
      !event.target.classList.contains(`${this.theme}-disabled-text`)
    ) {
      this._dataSelectEvent = "mouseclick";
      this.removeClassActive();
      let date, displayDate;
      if (this._isMobile) {
        // setting event target value if its on mobile
        date = event.target.value && event.target.value.split("-");
        displayDate =
          date && new Date(date[0], parseInt(date[1], 10) - 1, date[2]);
      } else {
        let yr = this.template.querySelector("select").value;
        let mo = this.month;
        let da = event.target.textContent;
        if (event.target.parentElement.classList.contains("prev-month")) {
          mo--;
        } else if (
          event.target.parentElement.classList.contains("next-month")
        ) {
          mo++;
        }

        displayDate = new Date(yr, mo, da);
        this.chosenMonth = displayDate.getMonth();
        this.chosenYear = displayDate.getYear();
      }
      this.assignDate(displayDate);
      this.hideCalendar();
    }
  }

  assignDate(value) {
    this.setValue(value);
    if (this && this.name) {
      pubsub.fire(this.name, "valuechange", {
        name: this.name,
        value: this.value
      });
    }
    this.dispatchEvent(
      new CustomEvent("change", {
        bubbles: true,
        composed: true
      })
    );
  }

  triggerEvent(el, type) {
    const e = new CustomEvent(type, {
      bubbles: true,
      cancelable: false
    });
    el.dispatchEvent(e);
  }

  toggleDatePicker(event) {
    if (!this.dropdownTrigger) {
      return;
    }
    if (this._readonly || this._disabled) {
      return;
    }
    if (!this._isMobile) {
      if (this.dropdownTrigger.classList.contains(`${this.theme}-is-open`)) {
        this.hideCalendar(event);
      } else {
        this.showCalendar(event);
      }
    }
  }

  maskInput(event) {
    this._displayValue = event.target.value;
    this.isNewdate = true;
    if (event && event.key !== "Enter") {
      this._dataSelectEvent = "keydown";
      this.hideCalendar();
    }
    this._value = this.formatValue(this.parseInputValue(this._displayValue));
  }

  checkIndex(i, index) {
    let tableDiv = this.template.querySelector("table  tbody");
    if (tableDiv.rows[i].cells[index].classList.contains("curr-month")) {
      tableDiv.rows[i].cells[index].focus();
      return true;
    }
    return false;
  }

  dateFocus(display) {
    if (display === "nextMonth" && this.template.querySelector(".dayId1")) {
      this.template.querySelector(".dayId1").focus();
    } else if (
      display === "prevMonth" &&
      this.days &&
      this.template.querySelector(".dayId" + this.days)
    ) {
      this.template.querySelector(".dayId" + this.days).focus();
    } else if (display === "nextMonth-down/up") {
      for (let week = 0; week < MAX_WEEKS_IN_MONTH; week++) {
        let result = this.checkIndex(week, this.cellIndex);
        if (result) break;
      }
    } else if (display === "prevMonth-down/up") {
      for (let week = MAX_WEEKS_IN_MONTH - 1; week > 0; week--) {
        let result = this.checkIndex(week, this.cellIndex);
        if (result) break;
      }
    } else if (display === "currentDay") {
      const day = Math.min(this._focusDayOfMonth, this.days);
      const td = this.template.querySelector(`.dayId${day}`);
      if (td) {
        td.focus();
      }
    }
    this.setFocus = false;
  }

  setMonth(month, key) {
    if (key === "ArrowRight" || key === "ArrowLeft") {
      this.setFocus = month;
    } else if (key === "ArrowDown" || key === "ArrowUp") {
      this.setFocus = `${month}-down/up`;
    } else if (key === "PageDown" || key === "PageUp") {
      this.setFocus = "currentDay";
    }
    this.triggerEvent(this.template.querySelector("." + month), "mousedown");
  }

  setYear(year) {
    this.selectedYear = String(year);
    this.refreshCalendar = true;
    this.setFocus = "currentDay";
    this.calendarDisplay();
  }

  shiftFocus(event) {
    const key = event.key;
    this.cellIndex = event.target.cellIndex;
    this._focusDayOfMonth = Number(event.target.textContent);
    const navDays = (val) => {
      if (
        this.template.querySelector(".dayId" + val) &&
        val <= this.days &&
        val > 0
      ) {
        this.template.querySelector(".dayId" + val).focus();
      } else if (val > this.days) {
        this.setMonth("nextMonth", key);
      } else {
        this.setMonth("prevMonth", key);
      }
      event.preventDefault();
    };
    if (
      (key === "ArrowRight" || key === "ArrowLeft") &&
      event.target.classList.contains("day-val")
    ) {
      let val = Number(event.target.textContent);
      val = key === "ArrowRight" ? val + 1 : val - 1;
      navDays(val);
    } else if (key === "ArrowUp" || key === "ArrowDown") {
      if (event.target.classList.contains("slds-select")) {
        this.triggerEvent(
          this.template.querySelector(".slds-select"),
          "mousedown"
        );
      } else if (event.target.classList.contains("day-val")) {
        let val = Number(event.target.textContent);
        val = key === "ArrowDown" ? val + 7 : val - 7;
        navDays(val);
      }
    } else if (key === "Home") {
      const week = event.target.parentNode;
      const days = week.querySelectorAll("td");
      for (const day of days) {
        if (day.classList.contains("curr-month")) {
          day.focus();
          break;
        }
      }
      event.preventDefault();
    } else if (key === "End") {
      const week = event.target.parentNode;
      const days = week.querySelectorAll("td");
      for (let i = days.length - 1; i > 0; i--) {
        const day = days[i];
        if (day.classList.contains("curr-month")) {
          day.focus();
          break;
        }
      }
      event.preventDefault();
    } else if (key === "PageUp") {
      event.preventDefault();
      if (event.altKey) {
        this.setYear(Number(this.selectedYear) - 1);
      } else {
        this.setMonth("prevMonth", key);
      }
    } else if (key === "PageDown") {
      event.preventDefault();
      if (event.altKey) {
        this.setYear(Number(this.selectedYear) + 1);
      } else {
        this.setMonth("nextMonth", key);
      }
    } else if (
      (key === "Enter" || key === "Space Bar") &&
      event.target.dataset.id
    ) {
      if (event.target.dataset.type === "date") {
        this.onDateEnter(event);
      } else if (event.target.dataset.type === "icon") {
        // Open the calender and set focus to the date.
        this._dataSelectEvent = "iconclick";
        this.toggleDatePicker(event);
      } else {
        this.triggerEvent(
          this.template.querySelector(
            "[data-id=" + event.target.dataset.id + "]"
          ),
          "mousedown"
        );
      }
    } else if (event.shiftKey && event.key === "Tab") {
      let classes = event.target.classList;
      if (classes.contains("prevMonth")) {
        this.nextFocus("currentDate", event);
      } else if (classes.contains("currentDate")) {
        this.nextFocus(`${this.theme}-is-today`, event);
      } else if (
        classes.contains(`${this.theme}-is-today`) ||
        classes.contains("day-val")
      ) {
        this.nextFocus(`${this.theme}-select`, event);
      } else if (classes.contains(`${this.theme}-select`)) {
        this.nextFocus("nextMonth", event);
      }
    } else if (key === "Tab") {
      let classes = event.target.classList;
      const nextFocus = (targets) => {
        targets = targets.split(",");
        for (let i = 0; i < targets.length; i++) {
          if (this.template.querySelector("." + targets[i])) {
            this.template.querySelector("." + targets[i]).focus();
            break;
          }
        }
        event.preventDefault();
      };
      if (classes.contains("currentDate")) {
        nextFocus("prevMonth");
      } else if (classes.contains(`${this.theme}-select`)) {
        let targets = `${this.theme}-is-selected,${this.theme}-is-today,dayId1,currentDate`;
        nextFocus(targets);
      } else if (classes.contains("day-val")) {
        if (classes.contains(`${this.theme}-is-today`)) {
          nextFocus("currentDate");
        } else if (
          classes.contains(`${this.theme}-is-selected`) &&
          this.template.querySelector(`.${this.theme}-is-today`)
        ) {
          nextFocus(`${this.theme}-is-today`);
        } else nextFocus("currentDate");
      }
    } else if (key === "Escape") {
      this._dataSelectEvent = "keydown";
      this.hideCalendar();
    }
  }

  nextFocus(target, event) {
    if (this.template.querySelector("." + target)) {
      this.template.querySelector("." + target).focus();
    }
    event.preventDefault();
  }

  setDate() {
    if (this.template.querySelectorAll("select")[0])
      this.template.querySelectorAll("select")[0].value = this.selectedYear;
    if (this.selectedYear) {
      this.removeClassActive();
      this.chosenDayClass = this.day ? ".dayId" + Number(this.day) : "";
      this.setClassActive();
    }
    if (this.setFocus) {
      this.dateFocus(this.setFocus);
    }
  }

  newDate(event) {
    let dateVal = event.target.value;
    let validDate = this.parseInputValue(dateVal);
    if (validDate) {
      this.assignDate(validDate);
    }
  }

  currentDate(event) {
    let dateStr = this.parseValue(new Date());
    this.assignDate(dateStr);
    this.hideCalendar();
    event.preventDefault();
  }

  setPosition() {
    if (
      this.position === "right" &&
      this.template.querySelector(".calendar-div")
    ) {
      this.template.querySelector(".calendar-div").style.left =
        this.template
          .querySelector(`.${this.theme}-input`)
          .getBoundingClientRect().width -
        this.template.querySelector(".calendar-div").getBoundingClientRect()
          .width +
        "px";
    }
  }

  focusOutHandler() {
    if (!this.fromInteractionIn) {
      this._focusOutTimeout = this.hideCalendar();
    }
  }

  setInteractionFlag() {
    if (this._focusOutTimeout) {
      cancelDebounce(this._focusOutTimeout);
      delete this._focusOutTimeout;
    }
    this.fromInteractionIn = true;
    this.clearInteractionFlag();
  }

  _clearInteractionFlag() {
    if (this.fromInteractionIn) {
      delete this.fromInteractionIn;
    }
  }
  clearInteractionFlag = debounce(this._clearInteractionFlag.bind(this), 10);

  get rootElement() {
    return this.template;
  }

  clickHandler(event) {
    let target = event.target;

    if (!target) return;

    do {
      if (
        target.classList &&
        target.classList.contains(this.theme + "-dropdown-trigger")
      ) {
        return;
      }
      target = target.parentNode;
    } while (target);
  }

  _hideCalendar() {
    if (!this.dropdownTrigger) {
      return;
    }
    if (this.bubbleFocus) {
      this.dropdownTrigger.removeEventListener(
        "focusout",
        this._focusOutHandler
      );
      this.dropdownTrigger.removeEventListener(
        "focusin",
        this._setInteractionFlag
      );
      this.dropdownTrigger.removeEventListener(
        "mousedown",
        this._setInteractionFlag
      );
      delete this.bubbleFocus;
      if (
        this._dataSelectEvent !== "keydown" &&
        this._dataSelectEvent !== "iconclick"
      ) {
        this.template.querySelector('[data-id="datePickerBtn"]').focus();
      } else {
        this.focus();
      }
    }
    this.dropdownTrigger.classList.remove(`${this.theme}-is-open`);
    this.render();
  }

  hideCalendar = debounce(this._hideCalendar.bind(this), 10);

  showCalendar(event) {
    if (!this.dropdownTrigger) {
      return;
    }
    this.dropdownTrigger.classList.add(`${this.theme}-is-open`);
    if (this.isNewdate) {
      this.isNewdate = false;
      this.newDate(event);
    }
    if (!this.built) {
      this.calendarDisplay();
    } else if (this.refreshCalendar) {
      this.refreshCalendar = false;
      this.template.querySelectorAll("select")[0].value = this.chosenYear;
      this.month = this.chosenMonth;
      this.selectedYear = this.chosenYear;
      this.calendarDisplay();
    } else {
      const day = this.chosenDayClass
        ? this.template.querySelector(this.chosenDayClass)
        : this.template.querySelector(currentDayClass);
      if (this._dataSelectEvent === "iconclick") {
        delay(0).then(() => day.focus());
      }
    }
    if (!this.isPositionSet) {
      this.isPositionSet = true;
      this.setPosition();
    }
    if (!this.bubbleFocus) {
      this._focusOutHandler = this.focusOutHandler.bind(this);
      this._setInteractionFlag = this.setInteractionFlag.bind(this);
      this.dropdownTrigger.addEventListener("focusout", this._focusOutHandler);
      this.dropdownTrigger.addEventListener(
        "focusin",
        this._setInteractionFlag
      );
      this.dropdownTrigger.addEventListener(
        "mousedown",
        this._setInteractionFlag
      );
      this.bubbleFocus = true;
    }
  }

  get getHeight() {
    let divStyle = "via-" + this.theme + " datePickerHt";
    return divStyle;
  }

  get getPos() {
    let divStyle =
      "calendar-div " +
      this.theme +
      "-datepicker " +
      this.theme +
      "-dropdown " +
      this.theme +
      "-dropdown_left posAbsolute";
    return divStyle;
  }

  get errorClass() {
    let errorclass = `${this.theme}-form-element ${this.theme}-size_1-of-1 ${
      this.theme
    }-dropdown-trigger ${this.theme}-dropdown-trigger_click ${
      this.isError ? this.theme + "-has-error" : ""
    }`;
    return errorclass;
  }

  switchMonth(event) {
    this.refreshCalendar = true;
    let index = this.month;
    if (index === 0 || index === 11) {
      if (index === 0 && event.target.classList.contains("prevMonth")) {
        this.selectedYear = JSON.stringify(Number(this.selectedYear) - 1);
        index = 12;
      } else if (
        index === 11 &&
        !event.target.classList.contains("prevMonth")
      ) {
        this.selectedYear = JSON.stringify(Number(this.selectedYear) + 1);
        index = -1;
      }
    }
    index = event.target.classList.contains("prevMonth")
      ? index - 1
      : index + 1;
    this.month = index;
    this.calendarDisplay();
  }

  removeClassActive() {
    if (
      this.chosenDayClass &&
      this.template.querySelector(this.chosenDayClass)
    ) {
      const currentSelection = this.template.querySelector(this.chosenDayClass);

      currentSelection.setAttribute("aria-selected", false);
      currentSelection.classList.remove(`${this.theme}-is-selected`);
    }
  }

  setClassActive() {
    const currentDayEl = currentDayClass
      ? this.template.querySelector(currentDayClass)
      : null;
    const selectedDayEl = this.chosenDayClass
      ? this.template.querySelector(this.chosenDayClass)
      : null;
    if (currentDayEl) {
      if (
        currentYear === Number(this.selectedYear) &&
        currentMonth === this.month
      ) {
        currentDayEl.classList.add(`${this.theme}-is-today`);
        currentDayEl.setAttribute("aria-current", "date");
        if (this._dataSelectEvent === "iconclick") {
          currentDayEl.focus();
        }
      } else {
        currentDayEl.classList.remove(`${this.theme}-is-today`);
      }
    }
    if (selectedDayEl) {
      if (
        Number(this.selectedYear) === Number(this.chosenYear) &&
        Number(this.month) === Number(this.chosenMonth)
      ) {
        selectedDayEl.setAttribute("aria-selected", true);
        selectedDayEl.classList.add(`${this.theme}-is-selected`);
        if (this._dataSelectEvent === "iconclick") {
          selectedDayEl.focus();
        }
      } else if (this.selectedYear !== this.chosenYear) {
        selectedDayEl.setAttribute("aria-selected", false);
        selectedDayEl.classList.remove(`${this.theme}-is-selected`);
      }
    }
  }

  yearSelected(event) {
    this.refreshCalendar = true;
    this.selectedYear = event.target.value;
    this.calendarDisplay();
  }

  calendarDisplay() {
    let month = this.month + 1;
    let year = this.selectedYear;
    let nextMonthDays;
    nextMonthDays =
      month === 1
        ? this.getMonthDays(12, year)
        : this.getMonthDays(month - 1, year);
    this.days = this.getMonthDays(month, year);
    let firstDay = new Date(year, month - 1, 1);
    let startDay = firstDay.getDay();
    this.setThePrintLoop(startDay, this.days, nextMonthDays, year, month);
  }

  setThePrintLoop = debounce(this.setThePrintLoopAux);

  setThePrintLoopAux(s, d, n, y, m) {
    this.DayArray = [{}];
    let j = 0;
    do {
      this.DayArray[j] = [];
      this.DayArray[j].id = j + 10;
      j++;
    } while (j < 6);
    let idOverride;
    let start = s - 1;
    let nextMonDays = 1;
    let b = 6;
    let k = 0;
    for (let i = 0; i < 42; i++) {
      let idPrefix = "dayId";
      let dateClass = `day-val day ${this.theme}-day`;
      let disabled = false;
      /* default values for a day in current month */
      let monthIdxAndYearVal = {
        monthIdx: m - 1,
        year: y
      };
      idOverride = NaN;
      if ((this.minDate || this.maxDate) && y && m) {
        let num = (i - s + 1).length > 1 ? i - s + 1 : "0" + (i - s + 1);
        let presentDate = new Date(
          parseInt(y, 10),
          parseInt(m - 1, 10),
          parseInt(num, 10)
        );
        let min = this.minDate;
        let max = this.maxDate;
        if ((min && presentDate < min) || (max && presentDate > max)) {
          dateClass += ` ${this.theme}-disabled-text`;
          disabled = true;
        }
      }
      if (!(i >= s && i - s < d)) {
        if (i >= s) {
          if (nextMonDays) {
            if (this.DayArray[4].length < 7) {
              idPrefix = "next-month-dayId";
              idOverride = nextMonDays;
              dateClass += ` ${this.theme}-day_adjacent-month next-month dayId-next`;
              k = 4;
            } else if (this.DayArray[5].length < 7) {
              idPrefix = "next-month-dayId";
              idOverride = nextMonDays;
              dateClass += ` ${this.theme}-day_adjacent-month next-month dayId-next`;
              k = 5;
            }
            monthIdxAndYearVal = this.getMonthIndexAndYearValue(m, y, true);
            nextMonDays++;
          }
        } else {
          if (n - start) {
            idPrefix = "prev-month-dayId";
            idOverride = n - start;
            dateClass += ` ${this.theme}-day_adjacent-month prev-month dayId-prev`;
            k = 0;
            start--;
            monthIdxAndYearVal = this.getMonthIndexAndYearValue(m, y, false);
          }
        }
      } else {
        dateClass += " curr-month dayId";
        if (i > b) {
          b = b + 7;
          k = k + 1;
        }
      }
      let val = Number(isNaN(idOverride) ? i - s + 1 : idOverride);
      let dayObj = {
        value: val,
        id: idPrefix + val,
        class: dateClass + val,
        disabled,
        ariaLabel: new Date(
          `${this.months[monthIdxAndYearVal.monthIdx]} ${val} ${
            monthIdxAndYearVal.year
          }`
        ).toDateString()
      };
      this.DayArray[k].push(dayObj);
    }
    this.built = true;
    Promise.resolve().then(() => {
      this.setDate();
    });
  }

  getMonthIndexAndYearValue(m, y, isNext) {
    if (isNext) {
      return {
        /* next month will be january (idx = 0) when current month is december */
        monthIdx: m === 12 ? 0 : m,
        /* next year will be + 1 when month is december */
        year: m === 12 ? y + 1 : y
      };
    }
    return {
      /* previous month will be december (idx = 11) when current month is january */
      monthIdx: m === 1 ? 11 : m - 2,
      /* previous year will be - 1 when month is january */
      year: m === 1 ? y - 1 : y
    };
  }

  getMonthDays(month, year) {
    let days;
    if (
      month === 1 ||
      month === 3 ||
      month === 5 ||
      month === 7 ||
      month === 8 ||
      month === 10 ||
      month === 12
    )
      days = 31;
    else if (month === 4 || month === 6 || month === 9 || month === 11)
      days = 30;
    else if (month === 2) {
      if (this.isLeapYear(year)) {
        days = 29;
      } else {
        days = 28;
      }
    }
    return days;
  }
  isLeapYear(year) {
    if (year % 4 === 0) return true; // is leap year
    return false; // is not leap year
  }

  @api
  focus() {
    this.template.querySelector("input").focus();
  }

  get inputElement() {
    return this.template.querySelector("input");
  }

  @api get _constraint() {
    if (!this._constraintApi) {
      const overrides = {
        badInput: () => {
          return this._displayValue == null || this._displayValue === ""
            ? false
            : !isValidDate(this.parseInputValue(this._displayValue));
        },
        rangeUnderflow: () => {
          return (
            this.minDate &&
            this.min &&
            this._displayValue &&
            dayjs(this.parseInputValue(this._displayValue)).isBefore(
              this.minDate
            )
          );
        },
        rangeOverflow: () => {
          return (
            this.maxDate &&
            this.max &&
            this._displayValue &&
            dayjs(this.parseInputValue(this._displayValue)).isAfter(
              this.maxDate
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
      });
    this.isError = !valid;
    return valid;
  }

  handleBlur() {
    const tooltip = this.template.querySelector("[data-field-level-help]");
    if (tooltip) {
      tooltip.closeTooltip();
    }
  }

  @api getIsError() {
    return this.isError;
  }

  get ariaInvalid() {
    return this.isError;
  }

  handleReadOnlyCalenderOpenInMobile() {
    if (!this.readOnly || !this._isMobile) {
      return;
    }
    const readOnlyDate = this.template.querySelector(
      ".datepicker_input__container"
    );
    if (readOnlyDate) {
      readOnlyDate.style.pointerEvents = "none";
    }
  }
}
/*
we should use the existing method for opening, closing, and toggling the dropdown; not using inline class changes every time - ZS
querySelectorAll()[0] should be replaced with querySelector() - ZS
we should use dateFns for date logic like getting the number of days in the month and determining if leap year - ZS
We should use dateFns for parsing/formatting. This isn't the expected behavior, we have no need of masking, we want to parse input of an expected format into a date object, not sanitize unexpected input - ZS
we should update to match naming conventions in timePicker:
  format->outputFormat
  mask->format
there are state assignments in formatCheck. we should either take them out or rename formatCheck to something more appropriate like 'setDisplayValue' or 'updateDisplayValue'
set value uses promise.resolve().them() as an async call, this is a little confusing - ZS
we should convert unit indecies to be generated by dateFns, this will be needed for internationalization. Really we should either do this inline with getters or if its static establish them as constants outside of the class def -zs
*/
