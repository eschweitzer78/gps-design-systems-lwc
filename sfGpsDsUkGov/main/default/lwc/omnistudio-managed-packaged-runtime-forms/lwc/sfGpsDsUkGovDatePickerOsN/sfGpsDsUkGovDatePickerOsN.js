/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api, track } from "lwc";
import OmnistudioDatePicker from "c/sfGpsDsOmniDatePickerOsN";
import SfGpsDsUkGovLabelMixin from "c/sfGpsDsUkGovLabelMixinOsN";
import tmpl from "./sfGpsDsUkGovDatePickerOsN.html";
import { computeClass } from "c/sfGpsDsHelpersOs";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsUkGovDatePickerOsN";
const ORIGINAL_INPUT_SELECTOR = "input[hidden]";
const DAY_INPUT_SELECTOR = 'input[name="date-input-day"]';

export default class SfGpsDsUkGovDatePickerOsN extends SfGpsDsUkGovLabelMixin(
  OmnistudioDatePicker
) {
  @api hideFormGroup;
  @api forceError;

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

  get computedFormGroupClassName() {
    return computeClass({
      "govuk-form-group": !this.hideFormGroup,
      "govuk-form-group--error": this.sfGpsDsHasAnyError && !this.hideFormGroup
    });
  }

  get computedAriaDescribedBy() {
    return computeClass({
      errorMessageBlock: this.sfGpsDsHasAnyError,
      helper: this.fieldLevelHelp
    });
  }

  get computedItemFormGroupClassName() {
    return computeClass({
      "govuk-form-group": !this.hideFormGroup
    });
  }

  get computedDateDayInputClassName() {
    return computeClass({
      "govuk-input": true,
      "govuk-date-input__input": true,
      "govuk-input--width-2": true,
      "govuk-input--error":
        this.hasDayError ||
        (this.sfGpsDsIsError && !(this.hasMonthError || this.hasYearError))
    });
  }

  get computedDateMonthInputClassName() {
    return computeClass({
      "govuk-input": true,
      "govuk-date-input__input": true,
      "govuk-input--width-2": true,
      "govuk-input--error":
        this.hasMonthError ||
        (this.sfGpsDsIsError && !(this.hasDayError || this.hasYearError))
    });
  }

  get computedDateYearInputClassName() {
    return computeClass({
      "govuk-input": true,
      "govuk-date-input__input": true,
      "govuk-input--width-4": true,
      "govuk-input--error":
        this.hasYearError ||
        (this.sfGpsDsIsError && !(this.hasDayError || this.hasMonthError))
    });
  }

  get computedShowErrorMessageBlock() {
    return this.sfGpsDsIsError || this.forceError;
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

      valid = !(
        Number.isNaN(day) ||
        Number.isNaN(month) ||
        Number.isNaN(year) ||
        year < 1000
      );
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

        this.hasDayError = Number.isNaN(day);
        this.hasMonthError = Number.isNaN(month);
        this.hasYearError = Number.isNaN(year) || year < 1000;

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
  sfGpsDsHandleDateBlur() {
    this.dispatchEvent(
      new CustomEvent("blur", {
        bubbles: true,
        composed: true
      })
    );
  }

  sfGpsDsHandleDateFocus() {
    this.dispatchEvent(
      new CustomEvent("focus", {
        bubbles: true,
        composed: true
      })
    );
  }

  // override setValue so we can capture changes
  setValue(value) {
    if (DEBUG) console.debug(CLASS_NAME, "> setValue", value, typeof value);
    if (DEBUG)
      console.log(CLASS_NAME, "setValue", "outputFormat: " + this.outputFormat);

    super.setValue(value);

    if (this._value) {
      let parsedValue = this.parseValue(this._value, true);
      if (DEBUG)
        console.log(CLASS_NAME, "setValue", "parsedValue: " + parsedValue);
      if (parsedValue && !Number.isNaN(parsedValue)) {
        this.dayValue = parsedValue.getDate();
        this.monthValue = parsedValue.getMonth() + 1;
        this.yearValue = parsedValue.getFullYear();
      }
    }

    if (DEBUG)
      console.log(
        CLASS_NAME,
        "< setValue",
        "dayValue: " + this.dayValue,
        "monthValue: " + this.monthValue,
        "yearValue: " + this.yearValue
      );
  }

  sfGpsDsHandleDayChange(event) {
    this.dayValue = event.target.value;
    this.sfGpsDsUpdateValue();
  }

  sfGpsDsHandleMonthChange(event) {
    this.monthValue = event.target.value;
    this.sfGpsDsUpdateValue();
  }

  sfGpsDsHandleYearChange(event) {
    this.yearValue = event.target.value;
    this.sfGpsDsUpdateValue();
  }

  sfGpsDsUpdateValue() {
    if (this.dayValue && this.monthValue && this.yearValue) {
      let day = parseInt(this.dayValue, 10);
      let month = parseInt(this.monthValue, 10);
      let year = parseInt(this.yearValue, 10);
      let date = new Date(year, month - 1, day);

      this.assignDate(year < 1000 || Number.isNaN(date) ? null : date);
    } else {
      this.assignDate(null);
    }
  }

  get sfGpsDsHasAnyError() {
    return (
      this.sfGpsDsIsError ||
      this.hasDayError ||
      this.hasMonthError ||
      this.hasYearError
    );
  }

  /* Override, the UK Gov date picker needs to address missing fields */

  get validationMessage() {
    const rv = this._constraint.validationMessage;
    if (DEBUG) console.debug(CLASS_NAME, "validationMessage", rv);
    return rv
      ? rv
      : this.hasDayError || this.hasMonthError || this.hasYearError
        ? this.errorMessage || ""
        : "";
  }
}
