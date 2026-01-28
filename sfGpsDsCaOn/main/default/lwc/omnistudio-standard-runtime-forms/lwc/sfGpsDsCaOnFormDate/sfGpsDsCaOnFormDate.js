/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
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

  handleDateChange(event) {
    const detail = event.detail;
    
    if (detail && detail.value) {
      // Update the OmniStudio element value with the ISO date
      this.elementValue = detail.value;
      
      // Trigger OmniStudio update
      if (this.updateDataJson) {
        this.updateDataJson(this.elementValue);
      }
    } else {
      this.elementValue = "";
      if (this.updateDataJson) {
        this.updateDataJson("");
      }
    }

    // Handle validation
    if (!detail.isValid && this.setCustomValidation) {
      this.setCustomValidation("Please enter a valid date");
    } else if (this.setCustomValidation) {
      this.setCustomValidation("");
    }
  }

  handleDateBlur(event) {
    // Trigger blur handling for validation
    if (this.handleBlur) {
      this.handleBlur(event);
    }
  }
}
