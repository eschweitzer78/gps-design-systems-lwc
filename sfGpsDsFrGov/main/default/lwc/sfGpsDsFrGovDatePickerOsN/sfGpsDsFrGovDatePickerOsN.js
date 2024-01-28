/*
 * Copyright (c) 2023-2024, Bouchra Mouhim, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api, track } from "lwc";
import OmnistudioDatePicker from "c/sfGpsDsOmniDatePickerOsN";
import tmpl from "./sfGpsDsFrGovDatePickerOsN.html";
import { computeClass } from "c/sfGpsDsHelpersOs";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsFrGovDatePickerOsN";
const ORIGINAL_INPUT_SELECTOR = "input[hidden]";
const DAY_INPUT_SELECTOR = "input[name='date-input-day']";

export default class SfGpsDsFrGovDatePickerOsN extends OmnistudioDatePicker {
  @api readOnly;
  @api forceError;
  @api hideAsterisk = false;

  @track dateValue = "";
  @track hasDateError = false;
  @track dateErrorMsg = "";
  @track hasErrors = false;

  render() {
    return tmpl;
  }

  get computedFormGroupClass() {
    return computeClass({
      "fr-input-group": true,
      "fr-input-group--error": this.sfGpsDsHasAnyError,
      "fr-input-group--disabled": this.readOnly
    });
  }

  get computedAriaDescribedBy() {
    return computeClass({
      errorMessageBlock: this.sfGpsDsHasAnyError,
      helper: this.fieldLevelHelp
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
    if (DEBUG) console.log(CLASS_NAME, "> setValue", value, typeof value);
    if (DEBUG)
      console.log(CLASS_NAME, "setValue", "outputFormat: " + this.outputFormat);

    super.setValue(value);

    if (this._value) {
      let parsedValue = this.parseValue(this._value, true);
      if (parsedValue && !isNaN(parsedValue)) {
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

  sfGpsDsHandleDateChange(event) {
    this.dateValue = event.target.value;
    this.sfGpsDsUpdateValue();
  }

  sfGpsDsUpdateValue() {
    if (this.dateValue) {
      let date = new Date(this.dateValue);

      this.assignDate(date);
    } else {
      this.assignDate(null);
    }
  }

  get sfGpsDsHasAnyError() {
    return this.sfGpsDsIsError || this.hasDateError;
  }

  get _errorMessage() {
    return this.errorMessage?.replace("Error:", "");
  }
}
