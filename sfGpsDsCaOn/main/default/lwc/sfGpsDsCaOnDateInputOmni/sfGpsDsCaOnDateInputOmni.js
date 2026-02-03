/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api, track } from "lwc";
import { OmniscriptBaseMixin } from "omnistudio/omniscriptBaseMixin";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsCaOnDateInputOmni";

/**
 * Ontario Design System Date Input for OmniStudio Custom LWC
 * Uses OmniscriptBaseMixin for proper OmniScript data integration.
 * Uses 3 separate inputs for day, month, and year
 *
 * Usage in OmniScript:
 * - LWC Component Name: sfGpsDsCaOnDateInputOmni
 * - Custom Attributes:
 *   - fieldName: Field name in omniJsonData
 *   - label: Field label
 *   - required: true/false
 *   - min/max: Date range validation (ISO format YYYY-MM-DD)
 */
export default class SfGpsDsCaOnDateInputOmni extends OmniscriptBaseMixin(
  LightningElement
) {
  /* ========================================
   * PUBLIC @api PROPERTIES
   * ======================================== */

  @api label = "";
  @api hintText = "";
  @api required = false;
  @api optional = false;
  @api disabled = false;
  @api errorMessage = "";
  @api min = ""; // ISO format: YYYY-MM-DD
  @api max = ""; // ISO format: YYYY-MM-DD
  @api dayLabel = "Day";
  @api monthLabel = "Month";
  @api yearLabel = "Year";
  @api className = "";

  // OmniScript integration
  @api fieldName = "";

  /* ========================================
   * PRIVATE STATE
   * ======================================== */

  @track _dayValue = "";
  @track _monthValue = "";
  @track _yearValue = "";
  @track _isInvalid = false;
  @track _validationMessage = "";

  _groupId = `date-group-${Math.random().toString(36).substring(2, 11)}`;
  _dayId = `date-day-${Math.random().toString(36).substring(2, 11)}`;
  _monthId = `date-month-${Math.random().toString(36).substring(2, 11)}`;
  _yearId = `date-year-${Math.random().toString(36).substring(2, 11)}`;
  _hintId = `date-hint-${Math.random().toString(36).substring(2, 11)}`;
  _errorId = `date-error-${Math.random().toString(36).substring(2, 11)}`;

  /* ========================================
   * PUBLIC API
   * ======================================== */

  @api
  get value() {
    return this._buildIsoDate();
  }
  set value(val) {
    if (val) {
      this._parseValue(val);
    } else {
      this._dayValue = "";
      this._monthValue = "";
      this._yearValue = "";
    }
  }

  @api
  checkValidity() {
    return this._validateDate();
  }

  @api
  reportValidity() {
    const isValid = this._validateDate();
    return isValid;
  }

  @api
  setCustomValidity(message) {
    this._validationMessage = message;
    this._isInvalid = !!message;
  }

  @api
  focus() {
    const dayInput = this.template.querySelector(`#${this._dayId}`);
    if (dayInput) dayInput.focus();
  }

  @api
  getValue() {
    return this._buildIsoDate();
  }

  @api
  setValue(isoDate) {
    this._parseValue(isoDate);
    this._updateOmniScriptData();
  }

  /* ========================================
   * LIFECYCLE
   * ======================================== */

  connectedCallback() {
    if (DEBUG) console.log(CLASS_NAME, "connectedCallback");
  }

  /* ========================================
   * COMPUTED PROPERTIES
   * ======================================== */

  get computedGroupClassName() {
    let classes = "ontario-date__group";
    if (this._isInvalid || this.errorMessage) {
      classes += " ontario-date--error";
    }
    if (this.className) {
      classes += ` ${this.className}`;
    }
    return classes;
  }

  get computedDayMonthInputClassName() {
    let classes = "ontario-input ontario-input--3-char-width";
    if (this._isInvalid || this.errorMessage) {
      classes += " ontario-input__error";
    }
    return classes;
  }

  get computedYearInputClassName() {
    let classes = "ontario-input ontario-input--5-char-width";
    if (this._isInvalid || this.errorMessage) {
      classes += " ontario-input__error";
    }
    return classes;
  }

  get computedAriaDescribedBy() {
    const ids = [];
    if (this.hintText) ids.push(this._hintId);
    if (this.errorMessage || this._validationMessage) ids.push(this._errorId);
    return ids.length > 0 ? ids.join(" ") : null;
  }

  get computedAriaInvalid() {
    return this._isInvalid || this.errorMessage ? "true" : "false";
  }

  get showFlag() {
    return this.required === true || this.optional === true;
  }

  get flagText() {
    if (this.required) return "required";
    if (this.optional) return "optional";
    return "";
  }

  get hasError() {
    return !!(this.errorMessage || this._validationMessage);
  }

  get displayErrorMessage() {
    return this.errorMessage || this._validationMessage;
  }

  get isDisabled() {
    return this.disabled === true || this.disabled === "true";
  }

  get isRequired() {
    return this.required === true || this.required === "true";
  }

  /* ========================================
   * PRIVATE METHODS
   * ======================================== */

  _parseValue(isoDate) {
    if (isoDate) {
      const parts = isoDate.split("-");
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

    // Required validation
    if (this.isRequired && !hasAnyValue) {
      this._validationMessage = "Date is required";
      this._isInvalid = true;
      return false;
    }

    // Partial input validation
    if (hasAnyValue && !(hasDay && hasMonth && hasYear)) {
      this._validationMessage = "Please enter a complete date";
      this._isInvalid = true;
      return false;
    }

    if (!hasAnyValue) {
      return true; // Empty is valid if not required
    }

    // Validate day range
    const day = parseInt(this._dayValue, 10);
    if (isNaN(day) || day < 1 || day > 31) {
      this._validationMessage = "Day must be between 1 and 31";
      this._isInvalid = true;
      return false;
    }

    // Validate month range
    const month = parseInt(this._monthValue, 10);
    if (isNaN(month) || month < 1 || month > 12) {
      this._validationMessage = "Month must be between 1 and 12";
      this._isInvalid = true;
      return false;
    }

    // Validate year range
    const year = parseInt(this._yearValue, 10);
    if (isNaN(year) || year < 1000 || year > 9999) {
      this._validationMessage = "Please enter a valid 4-digit year";
      this._isInvalid = true;
      return false;
    }

    // Validate the date is real (e.g., not Feb 30)
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

    // Validate min date
    if (this.min) {
      const minDateObj = new Date(this.min);
      if (testDate < minDateObj) {
        this._validationMessage = `Date must be on or after ${this._formatDisplayDate(minDateObj)}`;
        this._isInvalid = true;
        return false;
      }
    }

    // Validate max date
    if (this.max) {
      const maxDateObj = new Date(this.max);
      if (testDate > maxDateObj) {
        this._validationMessage = `Date must be on or before ${this._formatDisplayDate(maxDateObj)}`;
        this._isInvalid = true;
        return false;
      }
    }

    return true;
  }

  _formatDisplayDate(date) {
    return date.toLocaleDateString("en-CA", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }

  _updateOmniScriptData() {
    if (!this.fieldName) return;

    const isoDate = this._buildIsoDate();

    if (DEBUG)
      console.log(CLASS_NAME, "_updateOmniScriptData", this.fieldName, isoDate);

    // Use OmniscriptBaseMixin method to update OmniScript data
    this.omniUpdateDataJson({
      [this.fieldName]: isoDate
    });
  }

  _dispatchChange() {
    const isoDate = this._buildIsoDate();

    this.dispatchEvent(
      new CustomEvent("change", {
        detail: {
          value: isoDate,
          day: this._dayValue,
          month: this._monthValue,
          year: this._yearValue,
          isValid: !this._isInvalid
        },
        bubbles: true,
        composed: true
      })
    );

    this._updateOmniScriptData();
  }

  _dispatchInput() {
    const isoDate = this._buildIsoDate();

    this.dispatchEvent(
      new CustomEvent("input", {
        detail: {
          value: isoDate,
          day: this._dayValue,
          month: this._monthValue,
          year: this._yearValue
        },
        bubbles: true,
        composed: true
      })
    );

    this._updateOmniScriptData();
  }

  /* ========================================
   * EVENT HANDLERS
   * ======================================== */

  handleDayInput(event) {
    // Allow only digits
    this._dayValue = event.target.value.replace(/\D/g, "").substring(0, 2);
    event.target.value = this._dayValue;

    // Auto-advance to month if 2 digits entered
    if (this._dayValue.length === 2) {
      const monthInput = this.template.querySelector(`#${this._monthId}`);
      if (monthInput) monthInput.focus();
    }

    this._dispatchInput();
  }

  handleMonthInput(event) {
    // Allow only digits
    this._monthValue = event.target.value.replace(/\D/g, "").substring(0, 2);
    event.target.value = this._monthValue;

    // Auto-advance to year if 2 digits entered
    if (this._monthValue.length === 2) {
      const yearInput = this.template.querySelector(`#${this._yearId}`);
      if (yearInput) yearInput.focus();
    }

    this._dispatchInput();
  }

  handleYearInput(event) {
    // Allow only digits
    this._yearValue = event.target.value.replace(/\D/g, "").substring(0, 4);
    event.target.value = this._yearValue;

    this._dispatchInput();
  }

  handleBlur() {
    this._validateDate();
    this._dispatchChange();
  }

  handleKeydown(event) {
    // Allow backspace to navigate backwards
    if (event.key === "Backspace") {
      const target = event.target;
      if (target.value === "") {
        if (target.id === this._yearId) {
          const monthInput = this.template.querySelector(`#${this._monthId}`);
          if (monthInput) {
            monthInput.focus();
            event.preventDefault();
          }
        } else if (target.id === this._monthId) {
          const dayInput = this.template.querySelector(`#${this._dayId}`);
          if (dayInput) {
            dayInput.focus();
            event.preventDefault();
          }
        }
      }
    }
  }
}
