/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api, track } from "lwc";
import OmniscriptDatePicker from "omnistudio/datePicker";
import SfGpsDsUkGovLabelMixin from "c/sfGpsDsUkGovLabelMixinOsN";
import tmpl from "./sfGpsDsUkGovDatePickerOsN.html";
import { computeClass } from "c/sfGpsDsHelpersOs";

const ORIGINAL_INPUT_SELECTOR = "input[hidden]";
const DAY_INPUT_SELECTOR = "input[name='date-input-day']";
const ERROR_ID_SELECTOR = "[data-sf-gps-uk-gov-error-input]";
const DEBUG = false;

export default class SfGpsDsUkGovDatePickerOsN extends SfGpsDsUkGovLabelMixin(
  OmniscriptDatePicker,
  "large"
) {
  @api dayLabel = "Day";
  @track dayValue = "";
  @track hasDayError = false;
  @track dayErrorMsg = "";

  @api monthLabel = "Month";
  @track monthValue = "";
  @track hasMonthError = false;
  @track monthErrorMsg = "";

  @api yearLabel = "Year";
  @track yearValue = "";
  @track hasYearError = false;
  @track yearErrorMsg = "";

  @track hasErrors = false;

  render() {
    return tmpl;
  }

  get computedFormGroupClass() {
    return computeClass({
      "govuk-form-group": true,
      "govuk-form-group--error": this.hasAnyError
    });
  }

  get computedAriaDescribedBy() {
    return computeClass({
      errorMessageBlock: this.hasAnyError,
      helper: this.fieldLevelHelp
    });
  }

  get computedDateDayInputClass() {
    return computeClass({
      "govuk-input": true,
      "govuk-date-input__input": true,
      "govuk-input--width-2": true,
      "govuk-input--error":
        this.hasDayError ||
        (this.isError && !(this.hasMonthError || this.hasYearError))
    });
  }

  get computedDateMonthInputClass() {
    return computeClass({
      "govuk-input": true,
      "govuk-date-input__input": true,
      "govuk-input--width-2": true,
      "govuk-input--error":
        this.hasMonthError ||
        (this.isError && !(this.hasDayError || this.hasYearError))
    });
  }

  get computedDateYearInputClass() {
    return computeClass({
      "govuk-input": true,
      "govuk-date-input__input": true,
      "govuk-input--width-4": true,
      "govuk-input--error":
        this.hasYearError ||
        (this.isError && !(this.hasDayError || this.hasMonthError))
    });
  }

  // override
  connectedCallback() {
    super.connectedCallback();
    this._isMobile = false;
  }

  // override
  focus() {
    let elt = this.template.querySelector(DAY_INPUT_SELECTOR);
    if (elt) {
      elt.focus();
    }
  }

  // override
  _inputElement;

  get inputElement() {
    if (this._inputElement == null) {
      this._inputElement = this.template.querySelector(ORIGINAL_INPUT_SELECTOR);
    }

    return this._inputElement;
  }

  // override
  @api checkValidity() {
    let valid = super.checkValidity();

    if (
      valid &&
      this._connected &&
      (this.dayValue || this.monthValue || this.yearValue)
    ) {
      let day = parseInt(this.dayValue, 10);
      let month = parseInt(this.monthValue, 10);
      let year = parseInt(this.yearValue, 10);

      valid = !(isNaN(day) || isNaN(month) || isNaN(year) || year < 1000);
    }

    return valid;
  }

  @api reportValidity() {
    let valid = super.reportValidity();

    if (valid) {
      if (this.dayValue || this.monthValue || this.yearValue) {
        let day = parseInt(this.dayValue, 10);
        let month = parseInt(this.monthValue, 10);
        let year = parseInt(this.yearValue, 10);

        this.hasDayError = isNaN(day);
        this.hasMonthError = isNaN(month);
        this.hasYearError = isNaN(year) || year < 1000;

        valid = !(this.hasDayError || this.hasMonthError || this.hasYearError);

        if (!valid) {
          let requiredFields = [
            this.hasDayError ? this.dayLabel.toLowerCase() : null,
            this.hasMonthError ? this.monthLabel.toLowerCase() : null,
            this.hasYearError ? this.yearLabel.toLowerCase() : null
          ].filter((field) => field);
          let nRequiredFields = requiredFields.length;

          let errorMessage = `${
            this.label ? this.label : "Date"
          } must include a valid `;
          for (let i = 0; i < nRequiredFields; i++) {
            if (i > 0) {
              errorMessage += i === nRequiredFields - 1 ? " and " : ", ";
            }
            errorMessage += requiredFields[i];
          }

          this.isError = true;
          this.errorMessage = errorMessage;
        }
      } else {
        this.hasDayError = this.hasMonthError = this.hasYearError = false;
      }
    }

    return valid;
  }

  // override
  clickHandler() {}

  // override
  handleDateBlur() {
    this.dispatchEvent(
      new CustomEvent("blur", {
        bubbles: true,
        composed: true
      })
    );
  }

  handleDateFocus() {
    this.dispatchEvent(
      new CustomEvent("focus", {
        bubbles: true,
        composed: true
      })
    );
  }

  // override setValue so we can capture changes
  setValue(value) {
    super.setValue(value);

    if (this._value) {
      let parsedValue = this.parseValue(this._value, true);
      if (parsedValue && !isNaN(parsedValue)) {
        this.dayValue = parsedValue.getDate();
        this.monthValue = parsedValue.getMonth() + 1;
        this.yearValue = parsedValue.getFullYear();
      }
    }
  }

  handleDayChange(event) {
    this.dayValue = event.target.value;
    this.updateValue();
  }

  handleMonthChange(event) {
    this.monthValue = event.target.value;
    this.updateValue();
  }

  handleYearChange(event) {
    this.yearValue = event.target.value;
    this.updateValue();
  }

  updateValue() {
    if (this.dayValue && this.monthValue && this.yearValue) {
      let day = parseInt(this.dayValue, 10);
      let month = parseInt(this.monthValue, 10);
      let year = parseInt(this.yearValue, 10);
      let date = new Date(year, month - 1, day);

      this.assignDate(year < 1000 || isNaN(date) ? null : date);
    } else {
      this.assignDate(null);
    }
  }

  get hasAnyError() {
    return (
      this.isError ||
      this.hasDayError ||
      this.hasMonthError ||
      this.hasYearError
    );
  }

  @api
  getErrorDetails() {
    let rv = null;

    let elt = this.template.querySelector(ERROR_ID_SELECTOR);

    if (elt == null) {
      if (DEBUG)
        console.log("sfGpsDsUkGovDatePicker: cannot find input element");
    } else if (this.isCustomLwc) {
      if (elt.getErrorDetails) {
        rv = elt.getErrorDetails();
      } else {
        if (DEBUG)
          console.log(
            "sfGpsDsUkGovDatePicker: child input does not have getErrorDetails"
          );
      }
    }
    rv = elt
      ? {
          id: elt.id,
          errorMessage: this._errorMessage
        }
      : null;

    return rv;
  }

  get _errorMessage() {
    return this.errorMessage?.replace("Error: ", "");
  }
}
