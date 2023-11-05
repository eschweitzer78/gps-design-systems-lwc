/*
 * Copyright (c) 2022-2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmnistudioDatePicker from "c/sfGpsDsOmniDatePickerOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuNswSDatePickerOsN.html";

export default class SfGpsDsAuNswDatePickerOsN extends OmnistudioDatePicker {
  @api hideAsterisk = false;

  render() {
    return tmpl;
  }

  get computedFormItemClassName() {
    return computeClass({
      form__item: true
    });
  }

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.sfGpsDsIsError
    });
  }

  get computedLabelClassName() {
    return computeClass({
      "form-required": this.required && !this.hideAsterisk
    });
  }

  get computedInputClassName() {
    return computeClass({
      error: this.sfGpsDsIsError
    });
  }
}
