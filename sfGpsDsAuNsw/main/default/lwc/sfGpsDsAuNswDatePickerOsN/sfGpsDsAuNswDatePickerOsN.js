/*
 * Copyright (c) 2022-2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmnistudioDatePicker from "c/sfGpsDsOmniDatePickerOsN";
import SfGpsDsAuNswStatusHelperMixin from "c/sfGpsDsAuNswStatusHelperMixinOsN";
import tmpl from "./sfGpsDsAuNswDatePickerOsN.html";
import { computeClass } from "c/sfGpsDsHelpersOs";

export default class SfGpsDsAuNswDatePickerOsN extends SfGpsDsAuNswStatusHelperMixin(
  OmnistudioDatePicker
) {
  @api hideFormGroup = false;
  @api hideAsterisk = false;

  render() {
    return tmpl;
  }

  get computedLabelClassName() {
    return computeClass({
      "nsw-form__label": true,
      "nsw-form__required": this.required && !this.hideAsterisk
    });
  }

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.sfGpsDsIsError
    });
  }

  get computedFormGroupClassName() {
    return computeClass({
      "nsw-form__group": !this.hideFormGroup
    });
  }
}
