/*
 * Copyright (c) 2022-2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmnistudioDatePicker from "c/sfGpsDsOmniDatePickerOsN";
import tmpl from "./sfGpsDsAuNswSDatePickerOsN.html";
import { computeClass } from "c/sfGpsDsHelpersOs";

export default class extends OmnistudioDatePicker {
  @api hideAsterisk = false;

  get computedLabelClassName() {
    return {
      "form-required": this.required && !this.hideAsterisk
    };
  }

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.sfGpsDsIsError
    });
  }

  get computedInputClassName() {
    return {
      error: this.sfGpsDsIsError
    };
  }

  /* lifecycle */

  render() {
    return tmpl;
  }
}
