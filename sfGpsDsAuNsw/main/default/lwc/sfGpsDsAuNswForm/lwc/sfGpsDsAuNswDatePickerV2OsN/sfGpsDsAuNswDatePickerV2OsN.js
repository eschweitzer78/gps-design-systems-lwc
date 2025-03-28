/*
 * Portions copyright (c) 2024, Emmanuel Schweitzer and salesforce.com, inc.
 * Portions copyright (c) by Digital.NSW, incorporated under MIT licence.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import tmpl from "./sfGpsDsAuNswDatePickerV2OsN.html";
import tmplMulti from "./sfGpsDsAuNswDatePickerV2OsN-multi.html";

import { LightningElement, api, track } from "lwc";
import SfGpsDsAuNswStatusHelperMixin from "c/sfGpsDsAuNswStatusHelperMixinOsN";
import {
  computeClass,
  ISO8601_PATTERN,
  isDate,
  isValidDate,
  parseIso8601,
  formatTemplate,
  normaliseBoolean
} from "c/sfGpsDsHelpersOs";
import OnClickOutside from "c/sfGpsDsOnClickOutsideOs";

import dayjs from "omnistudio/dayjs";
import { shortDateFormat } from "omnistudio/salesforceUtils";
import { WrapperComponentConstraints } from "omnistudio/utility";
import { isEqual } from "omnistudio/lodash";
import pubsub from "omnistudio/pubsub";

const I18N = {
  invalidLocaleError: "Setting invalid locale ${2} to ${1}.",
  overflowError: "Date is after the allowed range.",
  underflowError: "Date is before the allowed range.",
  valueMissingError: "You must provide a date.",
  badInputError: "You must provide a date following the ${0} format.",
  headerDateFormat: "MMMM YYYY",
  ariaLabel: "Select date using calendar widget.",
  ariaLabelSelection:
    "Select date using calendar widget, selected date is {0}.",
  dayLabel: "Day",
  monthLabel: "Month",
  yearLabel: "Year",
  pickerCancelLabel: "Cancel",
  pickerAcceptLabel: "OK"
};

const DEFAULT_OUTPUT_FORMAT = "DD-MM-YYYY";
const DEFAULT_OUTPUT_TYPE = "string";

const CLASS_NAME = "SfGpsDsAuNswDatePickerV2OsN";
const DEBUG = false;

const dateFormat = shortDateFormat
  ? shortDateFormat.toUpperCase()
  : "MM/dd/yyyy";

const MERGE_FIELD_OPTIONS = ["min", "max", "value"];

export default class extends SfGpsDsAuNswStatusHelperMixin(
  LightningElement
  // eslint-disable-next-line @lwc/lwc/no-leading-uppercase-api-name
) {
  @api hideFormGroup = false;
  @api hideAsterisk = false;

  /* NSW DS */

  /**
   * api: multipleInput, Boolean
   * pass a boolean or the string true/false to flag this input as being multi-field
   */

  _multipleInput = false;
  _multipleInputOriginal;

  @api
  get multipleInput() {
    return this._multipleInputOriginal;
  }

  set multipleInput(value) {
    this._multipleInputOriginal = value;
    this._multipleInput = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: false
    });
  }

  /**
   * api : datesDisabled
   * pass a space-separated list of parsable dates to mark them as disabled
   */

  disabledArray = [];
  _datesDisabledOriginal;

  @api
  get datesDisabled() {
    return this._datesDisabledOriginal;
  }

  set datesDisabled(value) {
    this._datesDisabledOriginal = value;
    this.disabledArray =
      this.datesDisabled && this.datesDisabled instanceof String
        ? this.datesDisabled.split(" ").map((date) => this.parseValue(date))
        : [];
  }

  @track pickerVisible = false;

  /* OMNI */

  @api placeholder;
  @api label;
  @api name;
  @api localeFormatInvalidError;
  @api disabled;
  @api required;
  @api readOnly;
  @api size;
  @api position;
  @api fieldLevelHelp;
  @api requiredLabel;

  /***
   * api: localeFormat
   * passed by OmniScript
   */

  _localeFormat;
  _localeFormatOriginal;
  _weekdays;

  @api
  get localeFormat() {
    return this._localeFormatOriginal;
  }

  set localeFormat(value) {
    this._localeFormatOriginal = value;

    try {
      value = JSON.parse(value);
      this._localeFormat = value;
      const weekdays = value.weekdays;

      this._weekdays = weekdays
        ? [...weekdays.slice(1), weekdays[0]].map((item) => ({
            prefix: item.slice(0, 1),
            suffix: item.slice(1),
            item
          }))
        : [];

      dayjs.locale(value, null, true);
      dayjs.locale(value.name);
    } catch (e) {
      throw new Error(
        formatTemplate(
          this.localeFormatInvalidError || I18N.invalidLocaleError,
          {
            1: CLASS_NAME,
            2: value
          }
        )
      );
    }
  }

  /* api: messageWhenValueMissing */

  _messageWhenValueMissing;

  @api
  get messageWhenValueMissing() {
    return this._messageWhenValueMissing || I18N.valueMissingError;
  }

  set messageWhenValueMissing(value) {
    this._messageWhenValueMissing = value;
    if (DEBUG) console.log(CLASS_NAME, "set messageWhenValueMissing", value);
  }

  /* api: messageWhenBadInput */

  _messageWhenBadInput;

  @api
  get messageWhenBadInput() {
    return formatTemplate(this._messageWhenBadInput || I18N.badInputError, {
      0: this.format
    });
  }

  set messageWhenBadInput(value) {
    this._messageWhenBadInput = value;
    if (DEBUG) console.log(CLASS_NAME, "set messageWhenBadInput", value);
  }

  /* api: messageWhenRangeUnderflow */

  _messageWhenRangeUnderflow;

  @api
  get messageWhenRangeUnderflow() {
    return this._messageWhenRangeUnderflow
      ? this.mergeFields(this._messageWhenRangeUnderflow)
      : I18N.underflowError;
  }

  set messageWhenRangeUnderflow(value) {
    this._messageWhenRangeUnderflow = value;
    if (DEBUG) console.log(CLASS_NAME, "set messageWhenRangeUnderflow", value);
  }

  /* api: messageWhenRangeOverflow */

  @api
  get messageWhenRangeOverflow() {
    return this._messageWhenRangeOverflow
      ? this.mergeFields(this._messageWhenRangeOverflow)
      : I18N.overflowError;
  }

  set messageWhenRangeOverflow(value) {
    this._messageWhenRangeOverflow = value;
    if (DEBUG) console.log(CLASS_NAME, "set messageWhenRangeOverflow", value);
  }

  /* api: format */

  _format;
  _formatOriginal;

  @api
  get format() {
    const rv = this._format || dateFormat || "YYYY-MM-DD";

    if (DEBUG) console.log(CLASS_NAME, "get format", rv);

    return rv;
  }

  set format(value) {
    if (DEBUG) console.log(CLASS_NAME, "> set format", value);

    this._formatOriginal = value;
    this._format = value || dateFormat || "YYYY-MM-DD";
    this.setMinDate();
    this.setMaxDate();
    this.updateDisplayValue();

    if (DEBUG) console.log(CLASS_NAME, "< set format", this._format);
  }

  /* api: min, max */

  minDate;
  maxDate;

  _min;
  _max;

  @api
  get max() {
    return this._max;
  }

  set max(value) {
    if (DEBUG) console.log(CLASS_NAME, "> set max", value);

    this._max = value;
    this.setMaxDate();

    if (DEBUG) console.log(CLASS_NAME, "< set format", this._max);
  }

  @api
  get min() {
    return this._min;
  }

  set min(value) {
    if (DEBUG) console.log(CLASS_NAME, "> set min", value);

    this._min = value;
    this.setMinDate();

    if (DEBUG) console.log(CLASS_NAME, "< set min", this._min);
  }

  setMinDate() {
    this.minDate = this._min ? this.parseValue(this._min) : null;
  }

  setMaxDate() {
    this.maxDate = this._max ? this.parseValue(this._max) : null;
  }

  /* api: value and displayValue */

  @track _value;
  _parsedValue;

  @track _displayValue = "";
  @track _displayDayValue = "";
  @track _displayMonthValue = "";
  @track _displayYearValue = "";

  @api
  get value() {
    if (DEBUG) console.log(CLASS_NAME, "> get value");

    const rv = this._value;

    if (DEBUG) console.log(CLASS_NAME, "< get value", rv);

    return rv;
  }

  set value(value) {
    if (DEBUG) console.log(CLASS_NAME, "> set value", value, typeof value);

    this.setValue(value);

    if (DEBUG)
      console.log(CLASS_NAME, "< set value", this._value, typeof this._value);
  }

  setValue(value) {
    if (DEBUG) console.log(CLASS_NAME, "> setValue", value);

    this.sfGpsDsClearCustomValidation();
    value = this.parseValue(value);
    this._value = this.formatValue(value);
    this._parsedValue = dayjs(value);
    this.updateDisplayValue();

    if (DEBUG)
      console.log(CLASS_NAME, "< setValue", this._value, typeof this._value);
  }

  setAndDispatchValue(value) {
    if (DEBUG) console.log(CLASS_NAME, "> setAndDispatchValue", value);

    this.setValue(value);

    if (this.name && pubsub) {
      pubsub.fire(this.name, "valuechange", {
        name: this.name,
        value: this._value
      });
    }

    this.dispatchEvent(
      new CustomEvent("change", {
        bubbles: true,
        composed: true
      })
    );

    if (DEBUG) console.log(CLASS_NAME, "< setAndDispatchValue");
  }

  updateDisplayValue() {
    const val = this._parsedValue;

    if (DEBUG)
      console.log(
        CLASS_NAME,
        "> updateDisplayValue",
        val?.isValid() ? val?.toISOString() : "invalid date"
      );

    if (val && isValidDate(val.toDate())) {
      this._displayValue = val.format(this.format);
      this._displayDayValue = val.date();
      this._displayMonthValue = val.month() + 1;
      this._displayYearValue = val.year();
    } else {
      // Do not change the value of the individual fields
    }

    if (DEBUG)
      console.log(CLASS_NAME, "< updateDisplayValue", this._displayValue);
  }

  /* api: outputFormat */

  _outputFormat;

  @api
  get outputFormat() {
    return this._outputFormat || DEFAULT_OUTPUT_FORMAT;
  }

  set outputFormat(val) {
    if (DEBUG) console.log(CLASS_NAME, "> set outputFormat", val);

    this._outputFormat = val || DEFAULT_OUTPUT_FORMAT;
    this.updateDisplayValue();
    this.setMinDate();
    this.setMaxDate();

    if (DEBUG)
      console.log(CLASS_NAME, "< set outputFormat", this._outputFormat);
  }

  /* api: outputType */

  _outputType;

  @api
  get outputType() {
    return this._outputType || DEFAULT_OUTPUT_TYPE;
  }

  set outputType(value) {
    this._outputType = value;
  }

  /* getters */

  get debug() {
    return DEBUG;
  }

  get header() {
    return dayjs(new Date(this.currentYear, this.currentMonth, 1)).format(
      I18N.headerDateFormat
    );
  }

  get rows() {
    const firstDay = this.getDayOfWeek(this.currentYear, this.currentMonth, 1);
    const daysInMonth = this.daysInMonth(this.currentYear, this.currentMonth);
    const currentDay = this.getCurrentDay();
    const currentMonth = this.getCurrentMonth();
    const currentYear = this.getCurrentYear();

    let date = 1;
    let calendar = [];

    for (let i = 0; i < 6; i += 1) {
      let cols = [];
      for (let j = 0; j < 7; j += 1) {
        const disabled = this.isDisabledDate(
          date,
          this.currentMonth,
          this.currentYear
        );
        const selected =
          this._value &&
          date === this.selectedDay &&
          this.currentMonth === this.selectedMonth &&
          this.currentYear === this.selectedYear;

        const isDay = (i > 0 || j >= firstDay) && date <= daysInMonth;

        const isToday =
          isDay &&
          date === currentDay &&
          this.currentMonth === currentMonth &&
          this.currentYear === currentYear;

        const hasFocus = isDay && date === this.currentDay;

        cols.push({
          key: `cell-${i + 1}-${j + 1}`,
          date: isDay ? date : "",
          isDay,
          className: computeClass({
            "nsw-date-picker__date": true,
            "nsw-date-picker__date--today": isToday,
            "nsw-date-picker__date--disabled": disabled,
            "nsw-date-picker__date--selected": selected,
            "nsw-date-picker--keyboard-focus": hasFocus
          }),
          tabindexValue: hasFocus ? "0" : "-1",
          disabled
        });

        if (isDay) date += 1;
      }

      calendar.push({
        key: `row-${i + 1}`,
        cols
      });
    }

    return calendar;
  }

  get i18n() {
    return I18N || {};
  }

  get triggerAriaLabel() {
    return formatTemplate(
      this.selectedYear && this.selectedMonth && this.selectedDay
        ? I18N.ariaLabelSelection
        : I18N.ariaLabel,
      {
        0: this._displayValue
      }
    );
  }

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.sfGpsDsIsError
    });
  }

  get computedLabelClassName() {
    return {
      "nsw-form__label": true,
      "nsw-form__required": this.required && !this.hideAsterisk
    };
  }

  get computedFormGroupClassName() {
    return {
      "nsw-form__group": !this.hideFormGroup
    };
  }

  get computedPickerClassName() {
    return {
      "nsw-date-picker": true,
      "nsw-date-picker--is-visible": this.pickerVisible
    };
  }

  get computedIsPartInvalidDate() {
    return this._isPartInvalidDate && this.sfGpsDsIsError;
  }

  get computedIsPartInvalidMonth() {
    return this._isPartInvalidMonth && this.sfGpsDsIsError;
  }

  get computedIsPartInvalidYear() {
    return this._isPartInvalidYear && this.sfGpsDsIsError;
  }

  get computedDisabledOrReadOnly() {
    return this.disabled || this.readOnly;
  }

  /* methods */

  getCurrentDay(date) {
    return (date || new Date()).getDate();
  }

  getCurrentMonth(date) {
    return (date || new Date()).getMonth();
  }

  getCurrentYear(date) {
    return (date || new Date()).getFullYear();
  }

  getDayOfWeek(year, month, day) {
    const weekDay = new Date(year, month, day).getDay() - 1;
    return weekDay < 0 ? 6 : weekDay;
  }

  resetDayValue(day) {
    if (DEBUG) console.log(CLASS_NAME, "> resetDayValue", day);

    const totDays = this.daysInMonth(this.currentYear, this.currentMonth);

    if (day > totDays) {
      this.currentDay = day - totDays;
      this.showNextMonth();
    } else if (day < 1) {
      const newMonth = this.currentMonth === 0 ? 11 : this.currentMonth - 1;
      this.currentDay = this.daysInMonth(this.currentYear, newMonth) + day;
      this.showPrevMonth();
    } else {
      this.currentDay = day;
    }

    Promise.resolve().then(() => {
      const target = this.refs.body.querySelector("button[tabindex='0']");
      if (target) target.focus();
    });

    if (DEBUG) console.log(CLASS_NAME, "< resetDayValue", this.currentDay);
  }

  toggleCalendar(eventOrValue = null) {
    if (DEBUG)
      console.log(
        CLASS_NAME,
        "> toggleCalendar",
        eventOrValue,
        this.pickerVisible
      );

    if (!this.pickerVisible && eventOrValue !== false) {
      this.resetCalendar();
      this.placeCalendar();
    }

    if (eventOrValue != null) {
      this.pickerVisible = !!eventOrValue;
    } else {
      this.pickerVisible = !this.pickerVisible;
    }

    if (DEBUG) console.log(CLASS_NAME, "< toggleCalendar", this.pickerVisible);
  }

  showCalendar(event) {
    if (DEBUG) console.log(CLASS_NAME, "> showCalendar");

    if (!this.readOnly) this.toggleCalendar(event);

    if (DEBUG) console.log(CLASS_NAME, "< showCalendar");
  }

  hideCalendar() {
    if (DEBUG) console.log(CLASS_NAME, "> hideCalendar");

    this.toggleCalendar(false);

    if (DEBUG) console.log(CLASS_NAME, "< hideCalendar");
  }

  showNextMonth() {
    if (DEBUG) console.log(CLASS_NAME, "> showNextMonth");

    this.currentYear =
      this.currentMonth === 11 ? this.currentYear + 1 : this.currentYear;
    this.currentMonth = (this.currentMonth + 1) % 12;
    this.currentDay = this.checkDayInMonth();

    if (DEBUG) console.log(CLASS_NAME, "< showNextMonth");
  }

  showPrevMonth() {
    if (DEBUG) console.log(CLASS_NAME, "> showPrevMonth");

    this.currentYear =
      this.currentMonth === 0 ? this.currentYear - 1 : this.currentYear;
    this.currentMonth = this.currentMonth === 0 ? 11 : this.currentMonth - 1;
    this.currentDay = this.checkDayInMonth();

    if (DEBUG) console.log(CLASS_NAME, "< showPrevMonth");
  }

  showNextYear() {
    if (DEBUG) console.log(CLASS_NAME, "> showNextYear");

    this.currentYear += 1;
    this.currentMonth %= 12;
    this.currentDay = this.checkDayInMonth();

    if (DEBUG) console.log(CLASS_NAME, "< showNextYear");
  }

  showPrevYear() {
    if (DEBUG) console.log(CLASS_NAME, "> showPrevYear");

    this.currentYear -= 1;
    this.currentMonth %= 12;
    this.currentDay = this.checkDayInMonth();

    if (DEBUG) console.log(CLASS_NAME, "< showPrevYear");
  }

  checkDayInMonth() {
    return this.currentDay >
      this.daysInMonth(this.currentYear, this.currentMonth)
      ? 1
      : this.currentDay;
  }

  daysInMonth(year, month) {
    return 32 - new Date(year, month, 32).getDate();
  }

  selectedDay = false;
  selectedMonth = false;
  selectedYear = false;

  @track currentDay; // 1-31
  @track currentMonth; // 0-11
  @track currentYear;

  /**
   * Resets the calendar navigation.
   */

  resetCalendar() {
    if (DEBUG) console.log(CLASS_NAME, "> resetCalendar");

    let currentDate = this._parsedValue?.isValid()
      ? this._parsedValue?.toDate()
      : null;

    if (DEBUG) console.log(CLASS_NAME, "= resetCalendar", currentDate);

    this.currentDay = this.getCurrentDay(currentDate);
    this.currentMonth = this.getCurrentMonth(currentDate);
    this.currentYear = this.getCurrentYear(currentDate);

    this.selectedDay = currentDate ? this.currentDay : false;
    this.selectedMonth = currentDate ? this.currentMonth : false;
    this.selectedYear = currentDate ? this.currentYear : false;

    if (DEBUG)
      console.log(
        CLASS_NAME,
        "< resetCalendar",
        this.selectedDay,
        this.selectedMonth,
        this.selectedYear
      );
  }

  /**
   * Checks whether the date is disabled.
   * @param {number} day
   * @param {number} month
   * @param {number} year
   * @returns boolean indicating whether the date is disabled or not.
   */
  isDisabledDate(day, month, year) {
    let disabled = false;

    const dateParse = new Date(year, month, day);
    const minDate = this.minDate;
    const maxDate = this.maxDate;

    if (minDate && minDate > dateParse) {
      disabled = true;
    }

    if (!disabled && maxDate && maxDate < dateParse) {
      disabled = true;
    }

    if (!disabled && this.disabledArray?.length > 0) {
      if (
        this.disabledArray.some((disabledDate) => {
          return dateParse.getTime() === disabledDate.getTime();
        })
      ) {
        disabled = true;
      }
    }

    return disabled;
  }

  selectDate(day, month, year) {
    if (DEBUG) console.log(CLASS_NAME, "> selectDate", day, month, year);

    this.dateSelected = true;
    this.selectedDay = day;
    this.selectedMonth = month;
    this.selectedYear = year;

    this.setAndDispatchValue(
      new Date(this.selectedYear, this.selectedMonth, this.selectedDay)
    );

    if (this.refs.input) {
      this.refs.input.focus();
    } else if (this.multipleInput) {
      this.refs.trigger.focus();
    }

    this.hideCalendar();

    if (DEBUG) console.log(CLASS_NAME, "< selectDate");
  }

  placeCalendar() {
    let datePicker = this.refs?.datePicker;

    if (datePicker) {
      datePicker.style.left = "0px";
      datePicker.style.right = "auto";

      const pickerBoundingRect = datePicker.getBoundingClientRect();

      if (pickerBoundingRect.right > window.innerWidth) {
        datePicker.style.left = "auto";
        datePicker.style.right = "0px";
      }
    }
  }

  /* methods: parse and format */
  /* ------------------------- */

  /**
   * formatValue formats a date for either output or input.
   *
   * @param {Date} date
   * @param {string} outputFormat
   * @returns the formatted date
   */

  formatValue(date, outputFormat = true) {
    if (DEBUG)
      console.log(CLASS_NAME, "> formatValue", date, typeof date, outputFormat);

    let rv = null;

    if (DEBUG) console.log(CLASS_NAME, "= formatValue", isValidDate(date));

    if (isValidDate(date)) {
      rv =
        this.outputType === "string"
          ? dayjs(date).format(outputFormat ? this.outputFormat : this.format)
          : date;
    }

    if (DEBUG) console.log(CLASS_NAME, "< formatValue", rv);
    return rv;
  }

  /**
   * parseValue parses a date that has been provided as a value (vs. displayValue, keyed input).
   * In reality, it also accepts a date and an ISO 8601 formatted string. Otherwise it will use the
   * outputFormat to parse.
   *
   * @param {string|Date} value the parsable date
   * @returns the parsed date as a Date instance
   */

  // eslint-disable-next-line no-unused-vars
  parseValue(value) {
    if (DEBUG) console.log(CLASS_NAME, "> parseValue", value, typeof value);

    let rv = null;

    if (value && value !== "") {
      if (isDate(value) || value instanceof Number) {
        rv = new Date(value);
      } else if (value.match(ISO8601_PATTERN)) {
        rv = parseIso8601(value);
      }

      if (rv == null) {
        let result = dayjs(value, this.outputFormat);

        if (value === result.format(this.outputFormat)) {
          rv = result.toDate();
        } else {
          result = dayjs(value, this.format);

          if (value === result.format(this.format)) {
            rv = result.toDate();
          } else {
            rv = null;
          }
        }
      }
    }

    if (DEBUG) console.log(CLASS_NAME, "< parseValue", rv);

    return rv;
  }

  /**
   * parseInput parses a date that has been provided as a keyed in input (vs. a value).
   *
   * @param {string} input
   * @returns the parsed date as a Date instance
   */

  parseInput(input) {
    if (DEBUG) console.log(CLASS_NAME, "> parseInput", input, typeof input);

    let rv = null;

    if (input != null && input !== "") {
      const parseFormat = this.format;
      const day = dayjs(input, parseFormat);
      let date = day.toDate();

      if (isValidDate(date) && day.format(parseFormat) === input) {
        rv = date;
      }
    }

    if (DEBUG) console.log(CLASS_NAME, "< parseInput", rv);

    return rv;
  }

  /**
   * Merge the value of one of the pre-configured MERGE_FIELD_OPTIONS (%min%, %max%
   * and %value% into a provided template. This is for OmniStudio error messages
   * that have percent as the merge separator.
   *
   * @param {string} string the template to merge fields into
   * @returns the merged template
   */

  mergeFields(string) {
    const mergeFieldOptions = MERGE_FIELD_OPTIONS.reduce(
      (object, key) => ({
        ...object,
        [key]: this.formatValue(this.parseValue(this[key]), false)
      }),
      {}
    );

    return formatTemplate(string, mergeFieldOptions, { sep: "%" });
  }

  /* Event management */
  /* ---------------- */

  handleAccept() {
    if (DEBUG) console.log(CLASS_NAME, "> handleAccept");

    const day = this.refs.body.querySelector("button[tabindex='0']");

    if (day) {
      this.selectDate(
        Number(day.innerText),
        this.currentMonth,
        this.currentYear
      );
    }

    if (DEBUG) console.log(CLASS_NAME, "< handleAccept");
  }

  handleBodyClick(event) {
    if (DEBUG) console.log(CLASS_NAME, "> handleBodyClick");

    const day = event.target.closest("button");

    if (day) {
      this.selectDate(
        Number(day.innerText),
        this.currentMonth,
        this.currentYear
      );
    }

    if (DEBUG) console.log(CLASS_NAME, "< handleBodyClick", day);
  }

  /**
   * handleBodyKeydown executes on key down while on picker body.
   *
   * @param {Event} event
   */

  handleBodyKeydown(event) {
    if (DEBUG) console.log(CLASS_NAME, "> handleBodyKeydown", event.key);

    let day = this.currentDay;

    switch (event.key?.toLowerCase()) {
      case "arrowdown":
        event.preventDefault();
        event.stopPropagation();
        day += 7;
        this.resetDayValue(day);
        break;

      case "arrowright":
        event.preventDefault();
        event.stopPropagation();
        day += 1;
        this.resetDayValue(day);
        break;

      case "arrowleft":
        event.preventDefault();
        event.stopPropagation();
        day -= 1;
        this.resetDayValue(day);
        break;

      case "arrowup":
        event.preventDefault();
        event.stopPropagation();
        day -= 7;
        this.resetDayValue(day);
        break;

      case "end":
        event.preventDefault();
        event.stopPropagation();
        day =
          day + 6 - this.getDayOfWeek(this.currentYear, this.currentMonth, day);
        this.resetDayValue(day);
        break;

      case "home":
        event.preventDefault();
        event.stopPropagation();
        day -= this.getDayOfWeek(this.currentYear, this.currentMonth, day);
        this.resetDayValue(day);
        break;

      case "pagedown":
        event.preventDefault();
        event.stopPropagation();
        this.showNextMonth();
        break;

      case "pageup":
        event.preventDefault();
        event.stopPropagation();
        this.showPrevMonth();
        break;

      default:
    }

    if (DEBUG) console.log(CLASS_NAME, "< handleBodyKeydown");
  }

  /**
   * handlePickerKeydown catches an escape while picker is visible
   * and hides it.
   *
   * @param {Event} event
   */

  handlePickerKeydown(event) {
    if (DEBUG)
      console.log(
        CLASS_NAME,
        "> handlePickerKeydown",
        event.key,
        this.pickerVisible
      );

    if (event.key?.toLowerCase() === "escape" && this.pickerVisible) {
      event.stopPropagation();
      this.hideCalendar();

      if (this._hasFocus) {
        (this.multipleInput ? this.refs.dateInput : this.refs.input).focus();
      }
    }

    if (DEBUG) console.log(CLASS_NAME, "< handlePickerKeydown");
  }

  /**
   * handleInputKeydown executes on the main input key down when single input.
   *
   * @param {Event} event
   */

  handleInputKeydown(event) {
    if (DEBUG) console.log(CLASS_NAME, "> handleInputKeydown", event.key);

    this.isError = false;

    if (event.key?.toLowerCase() === "enter") {
      event.stopPropagation();
      this._displayValue = this.refs.input.value;
      this.setAndDispatchValue(this.refs.input.value);
      this.hideCalendar();
    } else if (event.key?.toLowerCase() === "arrowdown" && this.pickerVisible) {
      event.stopPropagation();
      this.refs.body.querySelector("button[tabindex='0']")?.focus();
    } else {
      this._displayValue = this.refs.input.value;
    }

    if (DEBUG) console.log(CLASS_NAME, "< handleInputKeydown");
  }

  // eslint-disable-next-line no-unused-vars
  handleInputChange(event) {
    if (DEBUG) console.log(CLASS_NAME, "> handleInputChange");

    if (this.multipleInput) {
      event.stopPropagation();

      // Use this as a temporary display values
      // if date is valid it will be reformated in updateDisplayValue
      const dV = (this._displayDayValue = this.refs.dateInput?.value);
      const mV = (this._displayMonthValue = this.refs.monthInput?.value);
      const yV = (this._displayYearValue = this.refs.yearInput?.value);

      const day = dV ? Number(dV) : NaN;
      const month = mV ? Number(mV) : NaN;
      const year = yV ? Number(yV) : NaN;

      if (!Number.isNaN(day) && !Number.isNaN(month) && !Number.isNaN(year)) {
        const newDate = new Date(year, month - 1, day);
        const isSame =
          newDate.getFullYear() === year &&
          newDate.getMonth() === month - 1 &&
          newDate.getDate() === day;

        this.setAndDispatchValue(
          isSame ? new Date(year, month - 1, day) : null
        );
      } else {
        this.setAndDispatchValue(null);
      }
    } else {
      event.stopPropagation();

      this._displayValue = this.refs.input?.value;
      this.setAndDispatchValue(this.refs.input?.value);
    }

    this.showHelpMessageIfInvalid();

    if (DEBUG) console.log(CLASS_NAME, "< handleInputChange");
  }

  handleFocusIn() {
    if (DEBUG) console.log(CLASS_NAME, "> handleFocus");
    this._hasFocus = true;
    if (DEBUG) console.log(CLASS_NAME, "< handleFocus");
  }

  handleFocusOut(event) {
    if (DEBUG) console.log(CLASS_NAME, "> handleBlur");

    if (!event.currentTarget.contains(event.relatedTarget)) {
      this._hasFocus = false;

      if (this.pickerVisible) {
        this.hideCalendar();
      }
    }

    if (DEBUG) console.log(CLASS_NAME, "< handleBlur");
  }

  handleInputFocus(event) {
    /* do not show calendarif coming from picker */
    if (!this.refs.datePicker.contains(event.relatedTarget)) {
      this.showCalendar();
    }
  }

  stopPropagation(event) {
    event.stopPropagation();
  }

  /* Lifecycle */
  /* --------- */

  render() {
    return this.multipleInput ? tmplMulti : tmpl;
  }

  _onClickOutside;
  _rendered = false;

  renderedCallback() {
    if (!this._rendered) {
      this._rendered = true;

      if (!this._onClickOutside) {
        this._onClickOutside = new OnClickOutside();
        this._onClickOutside.bind(this, "formGroup", (event) => {
          if (DEBUG) console.log(CLASS_NAME, "> clickOutside", event.target);

          this.hideCalendar();

          if (DEBUG) console.log(CLASS_NAME, "< clickOutside");
        });
      }
    }
  }

  _connected = false;

  connectedCallback() {
    this._connected = true;
    this.resetCalendar();
  }

  disconnectedCallback() {
    if (this._onClickOutside) {
      this._onClickOutside.unbind(this, "formGroup");
    }

    this._connected = false;
  }

  /* apis required for any omni form element */

  @api valuesAreEqual(a, b) {
    let A = this.parseValue(a);
    let B = this.parseValue(b);
    return isEqual(A, B);
  }

  @api
  focus() {
    if (this.multipleInput) {
      this.refs.dateInput?.focus();
    } else {
      this.refs.input?.focus();
    }
  }

  @track isError;
  @track errorMessage;

  /* api: _constraint */

  _constraintApi;
  _isPartInvalidDate;
  _isPartInvalidMonth;
  _isPartInvalidYear;

  @api
  get _constraint() {
    if (!this._constraintApi) {
      const overrides = {
        badInput: () => {
          if (DEBUG)
            console.log(CLASS_NAME, "> _constraint.badInput", this._value);

          let rv = true;

          if (this._multipleInput) {
            const dV = (this._displayDayValue = this.refs.dateInput?.value);
            const mV = (this._displayMonthValue = this.refs.monthInput?.value);
            const yV = (this._displayYearValue = this.refs.yearInput?.value);

            if (dV === "" || mV === "" || yV === "") {
              rv = false;
            } else {
              const day = Number(dV);
              const month = Number(mV);
              const year = Number(yV);

              this._isPartInvalidDate = Number.isNaN(day);
              this._isPartInvalidMonth = Number.isNaN(month);
              this._isPartInvalidYear = Number.isNaN(year);
              rv =
                this._isPartInvalidDate ||
                this._isPartInvalidMonth ||
                this._isPartInvalidYear;

              if (!rv) {
                const newDate = new Date(year, month - 1, day);
                this._isPartInvalidDate = newDate.getDate() !== day;
                this._isPartInvalidMonth =
                  !this._isPartInvalidDate && newDate.getMonth() !== month - 1;
                this._isPartInvalidYear =
                  !this._isPartInvalidDate &&
                  !this._isPartInvalidMonth &&
                  newDate.getFullYear() !== year;

                rv =
                  this._isPartInvalidDate ||
                  this._isPartInvalidMonth ||
                  this._isPartInvalidYear;
              }
            }
          } else {
            if (this._displayValue == null || this._displayValue === "") {
              rv = false;
            } else {
              rv = !isValidDate(this.parseInput(this._displayValue));
            }
          }

          if (DEBUG) console.log(CLASS_NAME, "< _constraint.badInput", rv);

          return rv;
        },
        patternMismatch: () => false,
        rangeOverflow: () => {
          const rv =
            this.maxDate &&
            this.max &&
            this._parsedValue?.isAfter(this.maxDate);

          if (rv) {
            this._isPartInvalidDate = true;
            this._isPartInvalidMonth = true;
            this._isPartInvalidYear = true;
          }

          return rv;
        },
        rangeUnderflow: () => {
          const rv =
            this.minDate &&
            this.min &&
            this._parsedValue?.isBefore(this.minDate);

          if (rv) {
            this._isPartInvalidDate = true;
            this._isPartInvalidMonth = true;
            this._isPartInvalidYear = true;
          }

          return rv;
        },
        stepMismatch: () => false,
        tooShort: () => false,
        tooLong: () => false,
        typeMismatch: () => false,
        valueMissing: () => {
          if (DEBUG)
            console.log(CLASS_NAME, "> _constraint.valueMissing", this._value);

          let rv = false;

          if (this._multipleInput) {
            const dV = (this._displayDayValue = this.refs.dateInput?.value);
            const mV = (this._displayMonthValue = this.refs.monthInput?.value);
            const yV = (this._displayYearValue = this.refs.yearInput?.value);

            rv = this.required && (dV === "" || mV === "" || yV === "");

            if (rv) {
              this._isPartInvalidDate = true;
              this._isPartInvalidMonth = true;
              this._isPartInvalidYear = true;
            }
          } else {
            rv =
              this.required &&
              (!this._parsedValue || !this._parsedValue.isValid());
          }

          if (DEBUG)
            console.log(
              CLASS_NAME,
              "< _constraint.valueMissing",
              rv,
              this.required
            );

          return rv;
        }
      };

      this._constraintApi = new WrapperComponentConstraints(
        () => this,
        () => this.refs.input || this.refs.dateInput,
        overrides,
        null
      );
    }
    return this._constraintApi;
  }

  @api
  get validity() {
    if (!this || !this._constraint) return null;

    if (DEBUG) console.log(CLASS_NAME, "> validity");

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

    if (DEBUG) console.log(CLASS_NAME, "< validity", out);

    return out;
  }

  @api checkValidity() {
    if (DEBUG) console.log(CLASS_NAME, "> checkValidity");

    const rv = !this._connected || this._constraint.checkValidity();

    if (DEBUG) console.log(CLASS_NAME, "< checkValidity", rv);
    return rv;
  }

  @api setCustomValidity(e) {
    if (DEBUG) console.log(CLASS_NAME, "> setCustomValidity", e);

    this._constraint.setCustomValidity(e);
    if (this._rendered && e) this.showHelpMessageIfInvalid();

    if (DEBUG) console.log(CLASS_NAME, "< setCustomValidity");
  }

  @api showHelpMessageIfInvalid() {
    return this.reportValidity();
  }

  @api reportValidity() {
    if (DEBUG) console.log(CLASS_NAME, "> reportValidity");

    let valid =
      !this._connected ||
      this._constraint.reportValidity((e) => {
        this.errorMessage = e;
      });
    this.isError = !valid;

    if (DEBUG) console.log(CLASS_NAME, "< reportValidity", valid);

    return valid;
  }

  /* additional apis for sfGpsDs */

  @api setCustomValidation(message) {
    if (DEBUG) console.log(CLASS_NAME, "> setCustomValidation", message);
    this._sfGpsDsCustomValidation = message;
    if (DEBUG)
      console.log(
        CLASS_NAME,
        "< setCustomValidation",
        "_sfGpsDsCustomValidation: " + this._sfGpsDsCustomValidation
      );
  }

  _sfGpsDsCustomValidation = "";

  @api sfGpsDsHasCustomValidation() {
    const rv = !!this._sfGpsDsCustomValidation;
    if (DEBUG) console.log(CLASS_NAME, "sfGpsDsHasCustomValidation", rv);
    return rv;
  }

  @api sfGpsDsClearCustomValidation() {
    if (DEBUG) console.log(CLASS_NAME, "sfGpsDsClearCustomValidation");
    this._sfGpsDsCustomValidation = "";
  }

  @api sfGpsDsGetCustomValidation() {
    const rv = this._sfGpsDsCustomValidation;
    if (DEBUG) console.log(CLASS_NAME, "sfGpsDsGetCustomValidation", rv);
    return rv;
  }

  get sfGpsDsIsError() {
    const rv = this.isError || this.sfGpsDsHasCustomValidation();
    if (DEBUG) console.log(CLASS_NAME, "get sfGpsDsIsError", rv);
    return rv;
  }

  get sfGpsDsErrorMessage() {
    return this.sfGpsDsGetCustomValidation() || this.errorMessage;
  }
}
