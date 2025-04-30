/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsAuVic2RplDropdownOsN from "c/sfGpsDsAuVic2RplDropdownOsN";
import SfGpsDsOmniInputMixinOsN from "c/sfGpsDsOmniInputMixinOsN";
import {
  isString,
  formatTemplate,
  isDate,
  parseIso8601,
  normaliseString,
  ISO8601_PATTERN
} from "c/sfGpsDsHelpers";
import dayjs from "omnistudio/dayjs";
import salesforceUtils from "omnistudio/salesforceUtils";
import { determineMaxGranularity, unitName } from "./vlocDayJSHelpers";
import { WrapperComponentConstraints } from "omnistudio/utility";

const FORMAT_DEFAULT = "HH:mm";

const OUTPUTTYPE_STRING = "string";
const OUTPUTTYPE_DATE = "date";
const OUTPUTTYPE_VALUES = [OUTPUTTYPE_DATE, OUTPUTTYPE_STRING];
const OUTPUTTYPE_DEFAULT = OUTPUTTYPE_STRING;

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuVic2TimePickerOsN";

export default class extends SfGpsDsOmniInputMixinOsN(
  SfGpsDsAuVic2RplDropdownOsN
) {
  @api localeFormat;

  /* api: ariaLabel */

  _ariaLabel;

  @api
  get ariaLabel() {
    return this._ariaLabel || this.label;
  }

  set ariaLabel(value) {
    if (value) {
      this._ariaLabel = value;
    }
  }

  /* api: format */

  _format;
  _formatGranularity;

  @api
  get format() {
    return this._format || FORMAT_DEFAULT;
  }

  set format(value) {
    if (DEBUG) console.log(CLASS_NAME, "> set format", value);

    this._format = value;

    if (this._format) {
      this.setInputValue();
      this.setOptions();
    }

    this._formatGranularity = determineMaxGranularity(this._format);

    if (DEBUG)
      console.log(
        CLASS_NAME,
        "< set format",
        this._format,
        this._formatGranularity
      );
  }

  /* api: interval */

  _interval;

  @api
  get interval() {
    return this._interval || 15;
  }

  set interval(value) {
    if (DEBUG) console.log(CLASS_NAME, "> set interval", value);

    this._interval = Number.isNaN(value)
      ? 15
      : isString(value)
        ? parseInt(value, 10)
        : value;

    if (DEBUG) console.log(CLASS_NAME, "< set interval", this._interval);
  }

  /* api: outputFormat */

  _outputFormat;

  @api
  get outputFormat() {
    return this._outputFormat || FORMAT_DEFAULT;
  }

  set outputFormat(value) {
    if (DEBUG) console.log(CLASS_NAME, "> set outputFormat", value);

    this._outputFormat = value;

    if (this._outputFormat) {
      this.setInputValue();
    }

    if (DEBUG)
      console.log(CLASS_NAME, "> set outputFormat", this._outputFormat);
  }

  /* api: outputType */

  _outputType = OUTPUTTYPE_DEFAULT;
  _outputTypeOriginal = OUTPUTTYPE_DEFAULT;

  @api
  get outputType() {
    return this._outputTypeOriginal;
  }

  set outputType(value) {
    this._outputTypeOriginal = value;
    this._outputType = normaliseString(value, {
      validValues: OUTPUTTYPE_VALUES,
      fallback: OUTPUTTYPE_DEFAULT
    });
  }

  /* api: localeFormatInvalidError */

  _localeFormatInvalidError;

  @api
  get localeFormatInvalidError() {
    return (
      this._localeFormatInvalidError ||
      salesforceUtils.timePickerLabels.cmpLocaleFormatsInvalid
    );
  }

  set localeFormatInvalidError(value) {
    this._localeFormatInvalidError = value;
  }

  /* api: messageWhenBadInput */

  _messageWhenBadInput;

  @api
  get messageWhenBadInput() {
    return formatTemplate(
      this._messageWhenBadInput ||
        salesforceUtils.timePickerLabels.cmpDateFieldNotValid,
      { 0: this.format }
    );
  }

  set messageWhenBadInput(value) {
    this._messageWhenBadInput = value;
  }

  /* api: messageWhenRangeUnderflow */

  _messageWhenRangeUnderflow;

  @api
  get messageWhenRangeUnderflow() {
    return this._messageWhenRangeUnderflow
      ? this.formatStringForDisplay(this._messageWhenRangeUnderflow)
      : "";
  }

  set messageWhenRangeUnderflow(value) {
    this._messageWhenRangeUnderflow = value;
  }

  /* api: messageWhenRangeOverflow */

  _messageWhenRangeOverflow;
  get messageWhenRangeOverflow() {
    return this._messageWhenRangeOverflow
      ? this.formatStringForDisplay(this._messageWhenRangeOverflow)
      : "";
  }

  set messageWhenRangeOverflow(val) {
    this._messageWhenRangeOverflow = val;
  }

  /* api: min */

  _min;

  @api
  get min() {
    return this._min;
  }

  set min(value) {
    if (DEBUG) console.log(CLASS_NAME, "> set min", value);

    this._min = this.parseValue(value);
    this.setOptions();

    if (DEBUG) console.log(CLASS_NAME, "< set min", this._min);
  }

  /* api: max */

  _max;

  @api
  get max() {
    return this._max;
  }

  set max(value) {
    if (DEBUG) console.log(CLASS_NAME, "> set max", value);

    this._max = this.parseValue(value);
    this.setOptions();

    if (DEBUG) console.log(CLASS_NAME, "< set max", this._max);
  }

  /* api overrides */

  @api
  get value() {
    if (DEBUG) console.log(CLASS_NAME, "> get value", this._value);

    const rv = this.formatInputValue(this.parseInputValue(this._searchValue));

    if (DEBUG) console.log(CLASS_NAME, "< get value", rv);

    return rv;
  }

  set value(value) {
    if (DEBUG) console.log(CLASS_NAME, "> set value", value);

    this.setInputValue(value || "");

    if (DEBUG)
      console.log(CLASS_NAME, "< set value", this._value, this._searchValue);
  }

  get _timeValue() {
    return this.parseInputValue(this._searchValue);
  }

  /* getters */

  _startTime;

  get startTime() {
    if (!this._startTime) {
      this._startTime = this._min || dayjs().startOf("day").toDate();
    }

    return this._startTime;
  }

  _endTime;

  get endTime() {
    if (!this._endTime) {
      this._endTime = this._max || dayjs().endOf("day").toDate();
    }

    return this._endTime;
  }

  _dateSource;

  get dateSource() {
    if (DEBUG) console.log(CLASS_NAME, "> get dateSource", this._dateSource);

    if (!this._dateSource) {
      this._dateSource = this._min || new Date();
    }

    let rv;

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

      rv = new Date();
    } else {
      rv = this._dateSource;
    }

    if (DEBUG) console.log(CLASS_NAME, "< get dateSource", rv);

    return rv;
  }

  get outputValue() {
    if (DEBUG) console.log(CLASS_NAME, "> get outputValue");

    const valueAsDate = super.value
      ? this.parseInputTimeToDate(super.value)
      : null;
    let rv = "";

    if (valueAsDate) {
      rv =
        this._outputType === OUTPUTTYPE_DATE
          ? valueAsDate
          : dayjs(valueAsDate).format(this._outputFormat);
    }

    if (DEBUG) console.log(CLASS_NAME, "> get outputValue", rv);

    return rv;
  }

  get computedShowNoResults() {
    /* The time picker allows to type any time, so no results is not relevant */
    return false;
  }

  /* methods */

  setOptions() {
    if (DEBUG) {
      console.log(
        CLASS_NAME,
        "> setOptions",
        "startTime=",
        JSON.stringify(this.startTime),
        "endTime=",
        JSON.stringify(this.endTime)
      );
    }

    const currentTime = new Date(this.startTime);
    let opts = [];
    let formattedVal;

    while (!dayjs(this.endTime).isBefore(currentTime)) {
      formattedVal = this.formatInputValue(currentTime);

      if (!opts.includes(formattedVal)) {
        opts.push(formattedVal);
      }

      currentTime.setMinutes(currentTime.getMinutes() + this.interval);
    }

    this._options = opts.map((item, index) => {
      return {
        id: `opt-${index + 1}`,
        label: item,
        value: item
      };
    });

    if (DEBUG)
      console.log(CLASS_NAME, "< setOptions", JSON.stringify(this._options));
  }

  formatStringForDisplay(value) {
    if (DEBUG) console.log(CLASS_NAME, "> formatStringForDisplay", value);

    const rv = formatTemplate(
      value,
      {
        min: this.min,
        max: this.max,
        value: this.value,
        startTime: this.startTime,
        endTime: this.endTime
      },
      "%"
    );

    if (DEBUG) console.log(CLASS_NAME, "> formatStringForDisplay", rv);

    return rv;
  }

  parseInputTimeToDate(value) {
    if (DEBUG) console.log(CLASS_NAME, "> parseInputTimeToDate", value);

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
      dayjs(date).isSame(
        this._min,
        /*vlocDayJSHelpers.*/ unitName(this.formatGranularity)
      )
    ) {
      date = this._min;
    }

    if (
      this._max &&
      date > this._max &&
      dayjs(date).isSame(
        this._max,
        /*vlocDayJSHelpers.*/ unitName(this.formatGranularity)
      )
    ) {
      date = this._max;
    }

    if (DEBUG) console.log(CLASS_NAME, "< parseInputTimeToDate", date);

    return date;
  }

  parseValue(value, isValue) {
    if (DEBUG) console.log(CLASS_NAME, "> parseValue", value, isValue);

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

    if (DEBUG) console.log(CLASS_NAME, "< parseValue", date);

    return date;
  }

  dateValueParser(value, isValue) {
    if (DEBUG)
      console.log(
        CLASS_NAME,
        "> dateValueParser",
        value,
        isValue,
        this._dateSource
      );

    let rv;

    if (isDate(value) || value instanceof Number) {
      if (DEBUG) console.log(CLASS_NAME, "= dateValueParser is Date");

      rv = new Date(value);

      if (isValue) {
        this._dateSource = rv;
      }
    } else if (value.match(ISO8601_PATTERN)) {
      if (DEBUG) console.log(CLASS_NAME, "= dateValueParser is ISO string");

      rv = parseIso8601(value);

      if (rv.toISOString() === value) {
        this._dateSource = rv;
      }
    } else {
      rv = dayjs(value, this.outputFormat);

      if (value === rv.format(this.outputFormat)) {
        if (DEBUG)
          console.log(CLASS_NAME, "= dateValueParser is output format");
        rv = rv.toDate();
      } else {
        rv = dayjs(value, this.format);

        if (value === rv.format(this.format)) {
          if (DEBUG) console.log(CLASS_NAME, "= dateValueParser is format");

          rv = rv.toDate();
        } else {
          rv = null;
        }
      }
    }

    if (DEBUG)
      console.log(CLASS_NAME, "< dateValueParser", rv, this._dateSource);

    return rv;
  }

  setInputValue(timeValue) {
    if (DEBUG)
      console.log(CLASS_NAME, "> setInputValue", this.format, timeValue);

    if (!timeValue && timeValue !== "") {
      /* i.e. call does not originate from set value */
      timeValue = this._timeValue;
    }

    if (timeValue) {
      super.value = this._searchValue = this.formatInputTime(timeValue, true);
    } else {
      super.value = this._searchValue = null;
    }

    if (DEBUG) console.log(CLASS_NAME, "< setInputValue", this._searchValue);
  }

  isValidDate(value) {
    return isDate(value) && !Number.isNaN(value.getTime());
  }

  parseInputValue(inputValue) {
    if (DEBUG) console.log(CLASS_NAME, "> parseInputValue", inputValue);

    let date = null;

    if (inputValue != null && inputValue !== "") {
      const parseFormat = this.format;

      const day = dayjs(inputValue, parseFormat);
      date = day.toDate();

      if (this.isValidDate(date) && day.format(parseFormat) === inputValue) {
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
      }
    }

    if (DEBUG) console.log(CLASS_NAME, "> parseInputValue", date);

    return date;
  }

  formatInputValue(date) {
    if (DEBUG) console.log(CLASS_NAME, "> formatInputValue", date, this.format);

    const rv = this.isValidDate(date) ? dayjs(date).format(this.format) : "";

    if (DEBUG) console.log(CLASS_NAME, "< formatInputValue", rv);

    return rv;
  }

  formatInputTime(value, isValue) {
    return this.formatInputValue(this.parseValue(value, isValue));
  }

  /* method overrides */

  normaliseSearchValue() {
    if (DEBUG)
      console.log(CLASS_NAME, "> normaliseSearchValue", this._searchValue);

    this._searchValue = this.formatInputValue(
      this.parseInputValue(this._searchValue)
    );
    this.showHelpMessageIfInvalid();

    if (DEBUG)
      console.log(CLASS_NAME, "< normaliseSearchValue", this._searchValue);
  }

  _constraintApi;

  get _constraint() {
    if (!this._constraintApi) {
      this._constraintApi = new WrapperComponentConstraints(
        () => this,
        () => this.refs.searchRef || { validity: {} },
        {
          badInput: () => {
            return this._searchValue == null || this._searchValue === ""
              ? false
              : !this.isValidDate(this.parseInputTimeToDate(this._searchValue));
          },
          rangeUnderflow: () =>
            this.startTime &&
            this.min &&
            dayjs(this.parseInputTimeToDate(this._searchValue)).isBefore(
              this._min
            ),
          rangeOverflow: () =>
            this.endTime &&
            this.max &&
            dayjs(this.parseInputTimeToDate(this._searchValue)).isAfter(
              this._max
            ),
          valueMissing: () => this._required && !this._searchValue
        }
      );
    }

    return this._constraintApi;
  }

  @api
  get validity() {
    if (DEBUG) console.log(CLASS_NAME, "> get validity");

    let rv = null;

    if (this._constraint) {
      rv = {};

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
        rv[constraintKey] = !!this._constraint.validity[constraintKey];
      }, this);
    }

    if (DEBUG) console.log(CLASS_NAME, "< get validity", rv);

    return rv;
  }

  @api checkValidity() {
    if (DEBUG) console.log(CLASS_NAME, "> checkValidity");

    const valid = !this._connected || this._constraint.checkValidity();

    if (DEBUG) console.log(CLASS_NAME, "< checkValidity", valid);

    return valid;
  }

  @api setCustomValidity(message) {
    if (DEBUG) console.log(CLASS_NAME, "> setCustomValidity", message);

    this._constraint.setCustomValidity(message);

    if (message) {
      this.showHelpMessageIfInvalid();
    }

    if (DEBUG) console.log(CLASS_NAME, "< setCustomValidity");
  }

  showHelpMessageIfInvalid() {
    if (DEBUG) console.log(CLASS_NAME, "> showHelpMessageIfInvalid");

    const valid = this.reportValidity();

    if (DEBUG) console.log(CLASS_NAME, "< showHelpMessageIfInvalid", valid);

    return valid;
  }

  @api reportValidity() {
    if (DEBUG) console.log(CLASS_NAME, "> reportValidity");

    const valid =
      !this._connected ||
      this._constraint.reportValidity((e) => {
        this.errorMessage = e;
        return true;
      });

    this._invalid = !valid;

    if (DEBUG) console.log(CLASS_NAME, "< reportValidity", valid);

    return valid;
  }

  /* lifecycle */

  connectedCallback() {
    if (DEBUG) console.log(CLASS_NAME, "> connectedCallback");

    const localeFormat =
      this.localeFormat ||
      salesforceUtils.timePickerLabels.cmpDayJsLocaleFormats;

    if (localeFormat) {
      try {
        let localeObj = JSON.parse(localeFormat);

        // add locale object
        dayjs.locale(localeObj, null, true);

        // switch to locale
        dayjs.locale(localeObj.name);
      } catch (e) {
        if (DEBUG)
          console.debug(CLASS_NAME, "connectedCallback localFormat", e);
        throw new Error(
          formatTemplate(this.localeFormatInvalidError, {
            1: "timePicker",
            2: localeFormat
          })
        );
      }
    }

    this.setOptions();

    this._connected = true;
    this.mode = "combobox-auto";

    if (DEBUG) console.log(CLASS_NAME, "< connectedCallback");
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._connected = false;
  }
}
