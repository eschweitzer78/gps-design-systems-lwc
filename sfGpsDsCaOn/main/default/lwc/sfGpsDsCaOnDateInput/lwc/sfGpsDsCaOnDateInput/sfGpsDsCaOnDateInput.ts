/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
// @ts-ignore - LWC module import
import { LABELS } from "c/sfGpsDsCaOnLabels";

// eslint-disable-next-line no-unused-vars
const DEBUG = false;
// eslint-disable-next-line no-unused-vars
const CLASS_NAME = "SfGpsDsCaOnDateInput";

export default class SfGpsDsCaOnDateInput extends SfGpsDsLwc {
  static renderMode = "light";

  /* API properties */

  // @ts-ignore
  @api label?: string;

  // @ts-ignore
  @api name?: string;

  // @ts-ignore
  @api hintText?: string;

  // @ts-ignore
  @api value?: string; // ISO format: YYYY-MM-DD

  // @ts-ignore
  @api required?: boolean;
  _required = this.defineBooleanProperty("required", { defaultValue: false });

  // @ts-ignore
  @api optional?: boolean;
  _optional = this.defineBooleanProperty("optional", { defaultValue: false });

  // @ts-ignore
  @api disabled?: boolean;
  _disabled = this.defineBooleanProperty("disabled", { defaultValue: false });

  // @ts-ignore
  @api minDate?: string; // ISO format: YYYY-MM-DD

  // @ts-ignore
  @api maxDate?: string; // ISO format: YYYY-MM-DD

  // @ts-ignore
  @api errorMessage?: string;

  // @ts-ignore
  @api dayLabel?: string;

  // @ts-ignore
  @api monthLabel?: string;

  // @ts-ignore
  @api yearLabel?: string;

  // @ts-ignore
  @api className?: string;

  /* Private properties */

  _dayValue = "";
  _monthValue = "";
  _yearValue = "";
  _isInvalid = false;
  _validationMessage = "";

  _groupId = `date-group-${Math.random().toString(36).substring(2, 11)}`;
  _dayId = `date-day-${Math.random().toString(36).substring(2, 11)}`;
  _monthId = `date-month-${Math.random().toString(36).substring(2, 11)}`;
  _yearId = `date-year-${Math.random().toString(36).substring(2, 11)}`;
  _hintId = `date-hint-${Math.random().toString(36).substring(2, 11)}`;
  _errorId = `date-error-${Math.random().toString(36).substring(2, 11)}`;

  /* Getters */

  get computedDayLabel(): string {
    return this.dayLabel || "Day";
  }

  get computedMonthLabel(): string {
    return this.monthLabel || "Month";
  }

  get computedYearLabel(): string {
    return this.yearLabel || "Year";
  }

  get computedGroupClassName(): string {
    let classes = "ontario-date__group";
    if (this._isInvalid || this.errorMessage) {
      classes += " ontario-date--error";
    }
    if (this.className) {
      classes += ` ${this.className}`;
    }
    return classes;
  }

  get computedInputClassName(): string {
    let classes = "ontario-input ontario-input--3-char-width";
    if (this._isInvalid || this.errorMessage) {
      classes += " ontario-input__error";
    }
    return classes;
  }

  get computedYearInputClassName(): string {
    let classes = "ontario-input ontario-input--5-char-width";
    if (this._isInvalid || this.errorMessage) {
      classes += " ontario-input__error";
    }
    return classes;
  }

  get computedAriaDescribedBy(): string | null {
    const ids: string[] = [];
    if (this.hintText) ids.push(this._hintId);
    if (this.errorMessage || this._validationMessage) ids.push(this._errorId);
    return ids.length > 0 ? ids.join(" ") : null;
  }

  get computedAriaInvalid(): string {
    return this._isInvalid || this.errorMessage ? "true" : "false";
  }

  get showFlag(): boolean {
    return this._required.value || this._optional.value;
  }

  get flagText(): string {
    if (this._required.value) return LABELS.Common.Required;
    if (this._optional.value) return LABELS.Common.Optional;
    return "";
  }

  get hasError(): boolean {
    return !!(this.errorMessage || this._validationMessage);
  }

  get displayErrorMessage(): string {
    return this.errorMessage || this._validationMessage;
  }

  get isDisabled(): boolean {
    return this._disabled.value;
  }

  /* Lifecycle */

  connectedCallback(): void {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
    this._parseValue();
  }

  /* Private methods */

  _parseValue(): void {
    if (this.value) {
      const parts = this.value.split("-");
      if (parts.length === 3) {
        this._yearValue = parts[0] || "";
        this._monthValue = parts[1] ? String(parseInt(parts[1], 10)) : "";
        this._dayValue = parts[2] ? String(parseInt(parts[2], 10)) : "";
      }
    }
  }

  _buildIsoDate(): string {
    if (this._yearValue && this._monthValue && this._dayValue) {
      const year = this._yearValue.padStart(4, "0");
      const month = this._monthValue.padStart(2, "0");
      const day = this._dayValue.padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    return "";
  }

  _validateDate(): boolean {
    this._validationMessage = "";
    this._isInvalid = false;

    // Check if all fields have values when any field has a value
    const hasDay = !!this._dayValue;
    const hasMonth = !!this._monthValue;
    const hasYear = !!this._yearValue;
    const hasAnyValue = hasDay || hasMonth || hasYear;

    // Required validation
    if (this._required.value && !hasAnyValue) {
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

    // Validate minDate
    if (this.minDate) {
      const minDateObj = new Date(this.minDate);
      if (testDate < minDateObj) {
        this._validationMessage = `Date must be on or after ${this._formatDisplayDate(minDateObj)}`;
        this._isInvalid = true;
        return false;
      }
    }

    // Validate maxDate
    if (this.maxDate) {
      const maxDateObj = new Date(this.maxDate);
      if (testDate > maxDateObj) {
        this._validationMessage = `Date must be on or before ${this._formatDisplayDate(maxDateObj)}`;
        this._isInvalid = true;
        return false;
      }
    }

    return true;
  }

  _formatDisplayDate(date: Date): string {
    return date.toLocaleDateString("en-CA", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }

  _dispatchChange(): void {
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
  }

  /* Event handlers */

  handleDayInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    // Allow only digits
    this._dayValue = target.value.replace(/\D/g, "").substring(0, 2);
    target.value = this._dayValue;

    // Auto-advance to month if 2 digits entered
    if (this._dayValue.length === 2) {
      const monthInput = this.querySelector(`#${this._monthId}`) as HTMLInputElement;
      if (monthInput) monthInput.focus();
    }

    this._dispatchInput();
  }

  handleMonthInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    // Allow only digits
    this._monthValue = target.value.replace(/\D/g, "").substring(0, 2);
    target.value = this._monthValue;

    // Auto-advance to year if 2 digits entered
    if (this._monthValue.length === 2) {
      const yearInput = this.querySelector(`#${this._yearId}`) as HTMLInputElement;
      if (yearInput) yearInput.focus();
    }

    this._dispatchInput();
  }

  handleYearInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    // Allow only digits
    this._yearValue = target.value.replace(/\D/g, "").substring(0, 4);
    target.value = this._yearValue;

    this._dispatchInput();
  }

  _dispatchInput(): void {
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
  }

  handleBlur(): void {
    this._validateDate();
    this._dispatchChange();
  }

  handleKeydown(event: KeyboardEvent): void {
    // Allow backspace to navigate backwards
    if (event.key === "Backspace") {
      const target = event.target as HTMLInputElement;
      if (target.value === "") {
        if (target.id === this._yearId) {
          const monthInput = this.querySelector(`#${this._monthId}`) as HTMLInputElement;
          if (monthInput) {
            monthInput.focus();
            event.preventDefault();
          }
        } else if (target.id === this._monthId) {
          const dayInput = this.querySelector(`#${this._dayId}`) as HTMLInputElement;
          if (dayInput) {
            dayInput.focus();
            event.preventDefault();
          }
        }
      }
    }
  }

  /* Public API methods */

  // @ts-ignore
  @api
  checkValidity(): boolean {
    return this._validateDate();
  }

  // @ts-ignore
  @api
  reportValidity(): boolean {
    const isValid = this._validateDate();
    return isValid;
  }

  // @ts-ignore
  @api
  setCustomValidity(message: string): void {
    this._validationMessage = message;
    this._isInvalid = !!message;
  }

  // @ts-ignore
  @api
  focus(): void {
    const dayInput = this.querySelector(`#${this._dayId}`) as HTMLInputElement;
    if (dayInput) dayInput.focus();
  }

  // @ts-ignore
  @api
  getValue(): string {
    return this._buildIsoDate();
  }

  // @ts-ignore
  @api
  setValue(isoDate: string): void {
    this.value = isoDate;
    this._parseValue();
  }
}
