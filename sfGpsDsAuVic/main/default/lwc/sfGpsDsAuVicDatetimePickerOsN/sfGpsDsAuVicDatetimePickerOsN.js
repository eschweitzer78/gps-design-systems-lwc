/*
 * Copyright (c) 2022-2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmnistudioDatetimePicker from "c/sfGpsDsOmniDatetimePickerOsN";
import tmpl from "./sfGpsDsAuVicDatetimePickerOsN.html";
import { computeClass } from "c/sfGpsDsHelpersOs";

export default class SfGpsDsAuVicDatetimePickerOsN extends OmnistudioDatetimePicker {
  render() {
    return tmpl;
  }

  get computedFormGroupClassName() {
    return computeClass({
      "form-group": true,
      invalid: this.sfGpsDsIsError,
      valid: !this.sfGpsDsIsError,
      required: this.required
    });
  }

  @api setCustomValidation(message) {
    super.setCustomValidation(message);
    this.dateEl.setCustomValidation(message);
  }

  @api sfGpsDsClearCustomValidation() {
    super.sfGpsDsClearCustomValidation();
    this.dateEl.sfGpsDsClearCustomValidation();
  }
}
