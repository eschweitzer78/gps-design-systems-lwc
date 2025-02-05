/*
 * Copyright (c) 2024, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmnistudioDatePicker from "c/sfGpsDsOmniDatePickerOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import StatusHelperMixin from "c/sfGpsDsAuQldStatusHelperMixinOsN";
import tmpl from "./sfGpsDsAuQldDatePickerOsN.html";

export default class extends StatusHelperMixin(OmnistudioDatePicker) {
  @api hideAsterisk = false;

  /* computed */

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.sfGpsDsIsError
    });
  }

  get computedInputClassName() {
    return {
      "qld__text-input": true,
      "qld__text-input--block": true,
      "qld__text-input--error": this.sfGpsDsIsError
    };
  }

  /* lifecycle */

  render() {
    return tmpl;
  }
}
