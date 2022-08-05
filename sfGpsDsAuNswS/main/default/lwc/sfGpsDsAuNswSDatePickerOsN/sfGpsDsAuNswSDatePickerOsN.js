/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmnistudioDatePicker from "omnistudio/datePicker";
import tmpl from "./sfGpsDsAuNswSDatePickerOsN.html";

export default class SfGpsDsAuNswDatePickerOsN extends OmnistudioDatePicker {
  @api hideAsterisk = false;

  render() {
    return tmpl;
  }

  get computedFormItemClassName() {
    return "form__item " + this.errorClass;
  }

  get computedLabelClassName() {
    return this.required && !this.hideAsterisk ? "form-required" : "";
  }

  get computedInputClassName() {
    return this.isError ? "error" : "";
  }
}
