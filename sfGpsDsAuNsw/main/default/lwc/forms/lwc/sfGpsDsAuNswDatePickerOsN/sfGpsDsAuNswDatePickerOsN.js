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

export default class extends SfGpsDsAuNswStatusHelperMixin(
  OmnistudioDatePicker
) {
  @api hideFormGroup = false;
  @api hideAsterisk = false;

  /* computed */

  get computedLabelClassName() {
    return {
      "nsw-form__label": true,
      "nsw-form__required": this.required && !this.hideAsterisk
    };
  }

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.sfGpsDsIsError
    });
  }

  get computedFormGroupClassName() {
    return {
      "nsw-form__group": !this.hideFormGroup
    };
  }

  get computedDisabledOrReadOnly() {
    return this.disabled || this.readOnly;
  }

  /* lifecycle */

  render() {
    return tmpl;
  }
}
