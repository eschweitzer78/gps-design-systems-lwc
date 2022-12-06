/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmnistudioDatePicker from "omnistudio/datePicker";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuNswSDatePickerOsN.html";

export default class SfGpsDsAuNswDatePickerOsN extends OmnistudioDatePicker {
  @api hideAsterisk = false;

  render() {
    return tmpl;
  }

  get computedFormItemClassName() {
    return computeClass({
      form__item: true,
      [this.errorClass]: this.errorClass
    });
  }

  get computedLabelClassName() {
    return computeClass({
      "form-required": this.required && !this.hideAsterisk
    });
  }

  get computedInputClassName() {
    return computeClass({
      error: this.isError
    });
  }
}
