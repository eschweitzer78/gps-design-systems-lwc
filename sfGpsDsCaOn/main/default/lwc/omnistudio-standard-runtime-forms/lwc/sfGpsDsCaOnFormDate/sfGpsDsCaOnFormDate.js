/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormDate from "c/sfGpsDsFormDate";
import tmpl from "./sfGpsDsCaOnFormDate.html";

export default class SfGpsDsCaOnFormDate extends SfGpsDsFormDate {
  /* computed */

  get computedMinDate() {
    // Convert OmniStudio min date format to ISO format if needed
    if (this._propSetMap?.min) {
      return this._propSetMap.min;
    }
    return null;
  }

  get computedMaxDate() {
    // Convert OmniStudio max date format to ISO format if needed
    if (this._propSetMap?.max) {
      return this._propSetMap.max;
    }
    return null;
  }

  /* lifecycle */

  render() {
    return tmpl;
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }

    this._readOnlyClass = "sfgpsdscaon-read-only";
    this.classList.add("caon-scope");
  }

  /* event handlers */

  /**
   * Handles date input changes from the sfGpsDsCaOnDateInput component.
   * Updates OmniScript JSON data via applyCallResp() which is the standard
   * OmniScript pattern for updating element values.
   *
   * @param {CustomEvent} event - Change event with detail.value (ISO date string)
   */
  handleDateChange(event) {
    const detail = event.detail;

    if (detail && detail.value) {
      // Update OmniScript data using the standard applyCallResp method
      // This triggers proper data binding and validation
      this.applyCallResp(detail.value);
    } else {
      // Clear the value
      this.applyCallResp("");
    }

    // Handle validation for invalid date format
    if (detail && !detail.isValid && this.setCustomValidation) {
      this.setCustomValidation("Please enter a valid date");
    } else if (this.setCustomValidation) {
      this.setCustomValidation("");
    }
  }

  /**
   * Handles blur event for validation triggering.
   * Delegates to parent's handleBlur for standard validation flow.
   *
   * @param {Event} event - Blur event
   */
  handleDateBlur(event) {
    // Trigger blur handling for validation
    if (this.handleBlur) {
      this.handleBlur(event);
    }
  }
}
