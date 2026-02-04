/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * Licensed under the BSD 3-Clause license.
 */

import SfGpsDsFormDate from "c/sfGpsDsFormDate";
import { computeClass } from "c/sfGpsDsHelpers";
import tmpl from "./sfGpsDsCaOnFormDate.html";

export default class SfGpsDsCaOnFormDate extends SfGpsDsFormDate {
  _uniqueId = `date-${Math.random().toString(36).substring(2, 11)}`;
  _dayValue = "";
  _monthValue = "";
  _yearValue = "";
  _validationMessage = "";
  _isInvalid = false;

  /* IDs */
  get groupId() {
    return `${this._uniqueId}-group`;
  }
  get dayId() {
    return `${this._uniqueId}-day`;
  }
  get monthId() {
    return `${this._uniqueId}-month`;
  }
  get yearId() {
    return `${this._uniqueId}-year`;
  }
  get hintId() {
    return `${this._uniqueId}-hint`;
  }
  get errorId() {
    return `${this._uniqueId}-error`;
  }

  /* Computed properties */
  get showRequiredFlag() {
    return this._propSetMap?.required === true;
  }
  get showOptionalFlag() {
    return this._propSetMap?.optional === true && !this._propSetMap?.required;
  }
  get computedAriaRequired() {
    return this._propSetMap?.required ? "true" : "false";
  }
  get computedAriaInvalid() {
    return this.hasError ? "true" : "false";
  }

  get computedAriaDescribedBy() {
    return computeClass({
      [this.hintId]: this.mergedHelpText,
      [this.errorId]: this.hasError
    });
  }

  get computedGroupClassName() {
    return computeClass({
      "ontario-date__group": true,
      "ontario-date--error": this.hasError
    });
  }

  get computedDayMonthInputClassName() {
    return computeClass({
      "ontario-input": true,
      "ontario-input--3-char-width": true,
      "ontario-input__error": this.hasError
    });
  }

  get computedYearInputClassName() {
    return computeClass({
      "ontario-input": true,
      "ontario-input--5-char-width": true,
      "ontario-input__error": this.hasError
    });
  }

  get hasError() {
    return this.sfGpsDsIsError || this._isInvalid || !!this._validationMessage;
  }

  get displayErrorMessage() {
    return this.sfGpsDsErrorMessage || this._validationMessage;
  }

  /* Parse value from elementValue */
  _parseValue() {
    const value = this.elementValue;
    if (value && typeof value === "string") {
      const parts = value.split("-");
      if (parts.length === 3) {
        this._yearValue = parts[0] || "";
        this._monthValue = parts[1] ? String(parseInt(parts[1], 10)) : "";
        this._dayValue = parts[2] ? String(parseInt(parts[2], 10)) : "";
      }
    }
  }

  _buildIsoDate() {
    if (this._yearValue && this._monthValue && this._dayValue) {
      const year = this._yearValue.padStart(4, "0");
      const month = this._monthValue.padStart(2, "0");
      const day = this._dayValue.padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    return "";
  }

  _validateDate() {
    this._validationMessage = "";
    this._isInvalid = false;

    const hasDay = !!this._dayValue;
    const hasMonth = !!this._monthValue;
    const hasYear = !!this._yearValue;
    const hasAnyValue = hasDay || hasMonth || hasYear;

    if (hasAnyValue && !(hasDay && hasMonth && hasYear)) {
      this._validationMessage = "Please enter a complete date";
      this._isInvalid = true;
      return false;
    }

    if (!hasAnyValue) return true;

    const day = parseInt(this._dayValue, 10);
    if (isNaN(day) || day < 1 || day > 31) {
      this._validationMessage = "Day must be between 1 and 31";
      this._isInvalid = true;
      return false;
    }

    const month = parseInt(this._monthValue, 10);
    if (isNaN(month) || month < 1 || month > 12) {
      this._validationMessage = "Month must be between 1 and 12";
      this._isInvalid = true;
      return false;
    }

    const year = parseInt(this._yearValue, 10);
    if (isNaN(year) || year < 1000 || year > 9999) {
      this._validationMessage = "Please enter a valid 4-digit year";
      this._isInvalid = true;
      return false;
    }

    const testDate = new Date(year, month - 1, day);
    if (
      testDate.getFullYear() !== year ||
      testDate.getMonth() !== month - 1 ||
      testDate.getDate() !== day
    ) {
      this._validationMessage = "Please enter a valid date";
      this._isInvalid = true;
      return false;
    }

    return true;
  }

  /* Event handlers */
  handleDayInput(event) {
    this._dayValue = event.target.value.replace(/\D/g, "").substring(0, 2);
    event.target.value = this._dayValue;

    if (this._dayValue.length === 2) {
      const monthInput = this.template.querySelector(`#${this.monthId}`);
      if (monthInput) monthInput.focus();
    }
  }

  handleMonthInput(event) {
    this._monthValue = event.target.value.replace(/\D/g, "").substring(0, 2);
    event.target.value = this._monthValue;

    if (this._monthValue.length === 2) {
      const yearInput = this.template.querySelector(`#${this.yearId}`);
      if (yearInput) yearInput.focus();
    }
  }

  handleYearInput(event) {
    this._yearValue = event.target.value.replace(/\D/g, "").substring(0, 4);
    event.target.value = this._yearValue;
  }

  handleDateBlur() {
    this._validateDate();
    const isoDate = this._buildIsoDate();
    if (isoDate || this._dayValue || this._monthValue || this._yearValue) {
      this.applyCallResp(isoDate);
    }
    if (this.handleBlur) {
      this.handleBlur({
        target: this.template.querySelector(`#${this.dayId}`)
      });
    }
  }

  handleKeydown(event) {
    if (event.key === "Backspace" && event.target.value === "") {
      if (event.target.id === this.yearId) {
        const monthInput = this.template.querySelector(`#${this.monthId}`);
        if (monthInput) {
          monthInput.focus();
          event.preventDefault();
        }
      } else if (event.target.id === this.monthId) {
        const dayInput = this.template.querySelector(`#${this.dayId}`);
        if (dayInput) {
          dayInput.focus();
          event.preventDefault();
        }
      }
    }
  }

  /* Lifecycle */
  render() {
    return tmpl;
  }

  connectedCallback() {
    if (super.connectedCallback) super.connectedCallback();
    this.classList.add("caon-scope");
    this._parseValue();
  }

  renderedCallback() {
    if (super.renderedCallback) super.renderedCallback();
    // Re-parse value if it changed externally
    if (
      this.elementValue &&
      !this._dayValue &&
      !this._monthValue &&
      !this._yearValue
    ) {
      this._parseValue();
    }
  }
}
