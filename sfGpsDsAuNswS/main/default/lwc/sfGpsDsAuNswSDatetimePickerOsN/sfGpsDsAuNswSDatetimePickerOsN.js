/*
 * Copyright (c) 2022-2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmnistudioDatetimePicker from "c/sfGpsDsOmniDatetimePickerOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuNswSDatetimePickerOsN.html";

export default class SfGpsDsAuNswSDatetimePickerOsN extends OmnistudioDatetimePicker {
  @api hideFormGroup = false;

  render() {
    return tmpl;
  }

  get computedLabelClassName() {
    return computeClass({
      "form-required": this.required
    });
  }

  get computedFormGroupClassName() {
    return computeClass({
      form__datetime: true,
      form__group: !this.hideFormGroup
    });
  }

  get computedFormItemClassName() {
    return "form__item";
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
