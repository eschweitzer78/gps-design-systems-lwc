/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api, track, LightningElement } from "lwc";
import tmpl from "./sfGpsDsAuVic2DatePicker.html";
import {
  computeClass,
  ISO8601_PATTERN,
  isDate,
  isValidDate,
  parseIso8601,
  formatTemplate
} from "c/sfGpsDsHelpers";

import dayjs from "c/sfGpsDsOsrtDayjs";
import { shortDateFormat } from "c/sfGpsDsOsrtSalesforceUtils";
import { WrapperComponentConstraints } from "c/sfGpsDsOsrtUtility";
import { isEqual } from "c/sfGpsDsOsrtLodash";
import pubsub from "c/sfGpsDsOsrtPubsub";

const I18N = {
  invalidLocaleError: "Setting invalid locale ${2} to ${1}.",
  overflowError: "Date is after the allowed range.",
  underflowError: "Date is before the allowed range.",
  valueMissingError: "You must provide a date.",
  badInputError: "You must provide a date following the ${0} format.",
  dayLabel: "Day",
  dayPlaceholder: "DD",
  monthLabel: "Month",
  monthPlaceholder: "MM",
  yearLabel: "Year",
  yearPlaceholder: "YYYY"
};

const DEFAULT_OUTPUT_FORMAT = "DD-MM-YYYY";
const DEFAULT_OUTPUT_TYPE = "string";

const CLASS_NAME = "sfGpsDsAuVic2DatePicker";
const DEBUG = false;

const dateFormat = shortDateFormat
  ? shortDateFormat.toUpperCase()
  : "MM/dd/yyyy";

const MERGE_FIELD_OPTIONS = ["min", "max", "value"];

// eslint-disable-next-line @lwc/lwc/no-leading-uppercase-api-name
export default class extends LightningElement {
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

  /* api: value and displayValue */

  _value;
  _parsedValue;

  @track _displayValue = "";
  @track _displayDayValue = "";
  @track _displayMonthValue = "";
  @track _displayYearValue = "";

  @api
  get value() {
    if (DEBUG) console.debug(CLASS_NAME, "> get value");

    const rv = this._value;

    if (DEBUG) console.debug(CLASS_NAME, "< get value", rv);

    return rv;
  }

  set value(value) {
    if (DEBUG) console.debug(CLASS_NAME, "> set value", value, typeof value);

    this.setValue(value);

    if (DEBUG)
      console.debug(CLASS_NAME, "< set value", this._value, typeof this._value);
  }

  /* api: outputFormat */

  _outputFormat;

  @api
  get outputFormat() {
    return this._outputFormat || DEFAULT_OUTPUT_FORMAT;
  }

  set outputFormat(val) {
    if (DEBUG) console.debug(CLASS_NAME, "> set outputFormat", val);

    this._outputFormat = val || DEFAULT_OUTPUT_FORMAT;
    this.updateDisplayValue();
    this.setMinDate();
    this.setMaxDate();

    if (DEBUG)
      console.debug(CLASS_NAME, "< set outputFormat", this._outputFormat);
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
      if (DEBUG) console.debug(CLASS_NAME, "set localeFormat", e);
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
    if (DEBUG) console.debug(CLASS_NAME, "set messageWhenValueMissing", value);
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
    if (DEBUG) console.debug(CLASS_NAME, "set messageWhenBadInput", value);
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
    if (DEBUG)
      console.debug(CLASS_NAME, "set messageWhenRangeUnderflow", value);
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
    if (DEBUG) console.debug(CLASS_NAME, "set messageWhenRangeOverflow", value);
  }

  /* api: format */

  _format;
  _formatOriginal;

  @api
  get format() {
    const rv = this._format || dateFormat || "YYYY-MM-DD";

    if (DEBUG) console.debug(CLASS_NAME, "get format", rv);

    return rv;
  }

  set format(value) {
    if (DEBUG) console.debug(CLASS_NAME, "> set format", value);

    this._formatOriginal = value;
    this._format = value || dateFormat || "YYYY-MM-DD";
    this.setMinDate();
    this.setMaxDate();
    this.updateDisplayValue();

    if (DEBUG) console.debug(CLASS_NAME, "< set format", this._format);
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
    if (DEBUG) console.debug(CLASS_NAME, "> set max", value);

    this._max = value;
    this.setMaxDate();

    if (DEBUG) console.debug(CLASS_NAME, "< set format", this._max);
  }

  @api
  get min() {
    return this._min;
  }

  set min(value) {
    if (DEBUG) console.debug(CLASS_NAME, "> set min", value);

    this._min = value;
    this.setMinDate();

    if (DEBUG) console.debug(CLASS_NAME, "< set min", this._min);
  }

  setMinDate() {
    this.minDate = this._min ? this.parseValue(this._min) : null;
  }

  setMaxDate() {
    this.maxDate = this._max ? this.parseValue(this._max) : null;
  }

  /* computed */

  get i18n() {
    return I18N || {};
  }

  get computedDateInputClassName() {
    return {
      "rpl-form__input": true,
      "rpl-form__input--default": true,
      "rpl-form__input--type-text": true,
      "rpl-form__input--centered": true,
      "rpl-form__input--invalid": this.computedIsPartInvalidDate,
      "rpl-form__input--disabled": this.disabled
    };
  }

  get computedMonthInputClassName() {
    return {
      "rpl-form__input": true,
      "rpl-form__input--default": true,
      "rpl-form__input--type-text": true,
      "rpl-form__input--centered": true,
      "rpl-form__input--invalid": this.computedIsPartInvalidMonth,
      "rpl-form__input--disabled": this.disabled
    };
  }

  get computedYearInputClassName() {
    return {
      "rpl-form__input": true,
      "rpl-form__input--default": true,
      "rpl-form__input--type-text": true,
      "rpl-form__input--centered": true,
      "rpl-form__input--invalid": this.computedIsPartInvalidYear,
      "rpl-form__input--disabled": this.disabled
    };
  }

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.sfGpsDsIsError
    });
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

  /* methods */

  @api setValue(value) {
    if (DEBUG) console.debug(CLASS_NAME, "> setValue", value);

    this.sfGpsDsClearCustomValidation();
    value = this.parseValue(value);
    this._value = this.formatValue(value);
    this._parsedValue = dayjs(value);
    this.updateDisplayValue();

    if (DEBUG)
      console.debug(CLASS_NAME, "< setValue", this._value, typeof this._value);
  }

  setAndDispatchValue(value) {
    if (DEBUG) console.debug(CLASS_NAME, "> setAndDispatchValue", value);

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

    if (DEBUG) console.debug(CLASS_NAME, "< setAndDispatchValue");
  }

  updateDisplayValue() {
    const val = this._parsedValue;

    if (DEBUG)
      console.debug(
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
      console.debug(CLASS_NAME, "< updateDisplayValue", this._displayValue);
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
      console.debug(
        CLASS_NAME,
        "> formatValue",
        date,
        typeof date,
        outputFormat
      );

    let rv = null;

    if (DEBUG) console.debug(CLASS_NAME, "= formatValue", isValidDate(date));

    if (isValidDate(date)) {
      rv =
        this.outputType === "string"
          ? dayjs(date).format(outputFormat ? this.outputFormat : this.format)
          : date;
    }

    if (DEBUG) console.debug(CLASS_NAME, "< formatValue", rv);
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

  parseValue(value) {
    if (DEBUG) console.debug(CLASS_NAME, "> parseValue", value, typeof value);

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

    if (DEBUG) console.debug(CLASS_NAME, "< parseValue", rv);

    return rv;
  }

  /**
   * parseInput parses a date that has been provided as a keyed in input (vs. a value).
   *
   * @param {string} input
   * @returns the parsed date as a Date instance
   */

  parseInput(input) {
    if (DEBUG) console.debug(CLASS_NAME, "> parseInput", input, typeof input);

    let rv = null;

    if (input != null && input !== "") {
      const parseFormat = this.format;
      const day = dayjs(input, parseFormat);
      let date = day.toDate();

      if (isValidDate(date) && day.format(parseFormat) === input) {
        rv = date;
      }
    }

    if (DEBUG) console.debug(CLASS_NAME, "< parseInput", rv);

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

    return formatTemplate(string, mergeFieldOptions, { sep: "{}" });
  }

  /* event management */

  handleInputChange(event) {
    if (DEBUG)
      console.debug(CLASS_NAME, "> handleInputChange", event.target?.value);

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

      this.setAndDispatchValue(isSame ? new Date(year, month - 1, day) : null);
    } else {
      this.setAndDispatchValue(null);
    }

    this.showHelpMessageIfInvalid();

    if (DEBUG) console.debug(CLASS_NAME, "< handleInputChange");
  }

  stopPropagation(event) {
    if (DEBUG) console.debug(CLASS_NAME, "> stopPropagation");

    event.stopPropagation();

    if (DEBUG) console.debug(CLASS_NAME, "< stopPropagation");
  }

  /* lifecycle */

  render() {
    return tmpl;
  }

  _connected = false;

  connectedCallback() {
    if (!this._connected) {
      this._connected = true;
    }
  }

  /* apis required for any omni form element */

  @api valuesAreEqual(a, b) {
    let A = this.parseValue(a);
    let B = this.parseValue(b);
    return isEqual(A, B);
  }

  @api
  focus() {
    this.refs.dateInput?.focus();
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
            console.debug(
              CLASS_NAME,
              "> _constraint.badInput",
              this._value,
              this.refs.dateInput?.value,
              this.refs.monthInput?.value,
              this.refs.yearInput?.value
            );

          let rv = true;

          const dV = (this._displayDayValue = this.refs.dateInput?.value);
          const mV = (this._displayMonthValue = this.refs.monthInput?.value);
          const yV = (this._displayYearValue = this.refs.yearInput?.value);

          if (DEBUG)
            console.debug(CLASS_NAME, "= _constraint.badInput", dV, mV, yV);

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

          if (DEBUG) console.debug(CLASS_NAME, "< _constraint.badInput", rv);

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
            console.debug(
              CLASS_NAME,
              "> _constraint.valueMissing",
              this._value
            );

          const dV = (this._displayDayValue = this.refs.dateInput?.value);
          const mV = (this._displayMonthValue = this.refs.monthInput?.value);
          const yV = (this._displayYearValue = this.refs.yearInput?.value);

          if (DEBUG)
            console.debug(CLASS_NAME, "= _constraint.valueMissing", dV, mV, yV);

          const rv =
            this.required &&
            /*(!this._parsedValue || !this._parsedValue.isValid());*/
            (dV === "" || mV === "" || yV === "");

          if (rv) {
            this._isPartInvalidDate = true;
            this._isPartInvalidMonth = true;
            this._isPartInvalidYear = true;
          }

          if (DEBUG)
            console.debug(
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
        () => this.refs.dateInput,
        overrides,
        null
      );
    }
    return this._constraintApi;
  }

  @api
  get validity() {
    if (!this || !this._constraint) return null;

    if (DEBUG) console.debug(CLASS_NAME, "> validity");

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

    if (DEBUG) console.debug(CLASS_NAME, "< validity", out);

    return out;
  }

  @api checkValidity() {
    if (DEBUG) console.debug(CLASS_NAME, "> checkValidity");

    const rv = !this._connected || this._constraint.checkValidity();

    if (DEBUG) console.debug(CLASS_NAME, "< checkValidity", rv);
    return rv;
  }

  @api setCustomValidity(e) {
    if (DEBUG) console.debug(CLASS_NAME, "> setCustomValidity", e);

    this._constraint.setCustomValidity(e);
    if (this._rendered && e) this.showHelpMessageIfInvalid();

    if (DEBUG) console.debug(CLASS_NAME, "< setCustomValidity");
  }

  @api showHelpMessageIfInvalid() {
    if (DEBUG) console.debug(CLASS_NAME, "> showHelpMessageIfInvalid");

    this.reportValidity();

    if (DEBUG) console.debug(CLASS_NAME, "< showHelpMessageIfInvalid");
  }

  @api reportValidity() {
    if (DEBUG) console.debug(CLASS_NAME, "> reportValidity");

    const valid =
      !this._connected ||
      this._constraint.reportValidity((e) => {
        this.errorMessage = e;
      });
    this.isError = !valid;
    this.setAttribute("data-invalid", this.isError);

    if (DEBUG) console.debug(CLASS_NAME, "< reportValidity", valid);

    return valid;
  }

  /* additional apis for sfGpsDs */

  @api setCustomValidation(message) {
    if (DEBUG) console.debug(CLASS_NAME, "> setCustomValidation", message);
    this._sfGpsDsCustomValidation = message;
    if (DEBUG)
      console.debug(
        CLASS_NAME,
        "< setCustomValidation",
        "_sfGpsDsCustomValidation: " + this._sfGpsDsCustomValidation
      );
  }

  _sfGpsDsCustomValidation = "";

  @api sfGpsDsHasCustomValidation() {
    const rv = !!this._sfGpsDsCustomValidation;
    if (DEBUG) console.debug(CLASS_NAME, "sfGpsDsHasCustomValidation", rv);
    return rv;
  }

  @api sfGpsDsClearCustomValidation() {
    if (DEBUG) console.debug(CLASS_NAME, "sfGpsDsClearCustomValidation");
    this._sfGpsDsCustomValidation = "";
  }

  @api sfGpsDsGetCustomValidation() {
    const rv = this._sfGpsDsCustomValidation;
    if (DEBUG) console.debug(CLASS_NAME, "sfGpsDsGetCustomValidation", rv);
    return rv;
  }

  get sfGpsDsIsError() {
    const rv = this.isError || this.sfGpsDsHasCustomValidation();
    if (DEBUG) console.debug(CLASS_NAME, "get sfGpsDsIsError", rv);
    return rv;
  }

  get sfGpsDsErrorMessage() {
    return this.sfGpsDsGetCustomValidation() || this.errorMessage;
  }
}
