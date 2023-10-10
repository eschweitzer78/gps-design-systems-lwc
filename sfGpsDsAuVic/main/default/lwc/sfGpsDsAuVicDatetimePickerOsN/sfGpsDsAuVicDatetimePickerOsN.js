/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmnistudioDatetimePicker from "omnistudio/datetimePicker";
import tmpl from "./sfGpsDsAuVicDatetimePickerOsN.html";
import { computeClass } from "c/sfGpsDsHelpersOs";

const timeQueryClass = "c-sf-gps-ds-au-vic-time-picker-os-n";
const dateQueryClass = "c-sf-gps-ds-au-vic-date-picker-os-n";

export default class SfGpsDsAuVicDatetimePickerOsN extends OmnistudioDatetimePicker {
  render() {
    return tmpl;
  }

  get computedFormGroupClassName() {
    return computeClass({
      "form-group": true,
      invalid: this.invalid,
      valid: !this.invalid,
      required: this.required
    });
  }

  get timeEl() {
    if (!this._timeEl) {
      this._timeEl = this.template.querySelector(timeQueryClass);
    }

    return this._timeEl;
  }

  get dateEl() {
    if (!this._dateEl) {
      this._dateEl = this.template.querySelector(dateQueryClass);
    }

    return this._dateEl;
  }

  setCustomValidity(e) {
    this.template.querySelector(dateQueryClass).setCustomValidity(e);
    this.template.querySelector(timeQueryClass).setCustomValidity(e);
  }
}
