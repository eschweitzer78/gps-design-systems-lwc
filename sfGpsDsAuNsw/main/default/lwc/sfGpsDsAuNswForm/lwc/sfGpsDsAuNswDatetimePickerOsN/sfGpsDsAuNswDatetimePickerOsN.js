/*
 * Copyright (c) 2022-2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmnistudioDatetimePicker from "c/sfGpsDsOmniDatetimePickerOsN";
import SfGpsDsAuNswStatusHelperMixin from "c/sfGpsDsAuNswStatusHelperMixinOsN";
import tmpl from "./sfGpsDsAuNswDatetimePickerOsN.html";

export default class extends SfGpsDsAuNswStatusHelperMixin(
  OmnistudioDatetimePicker
) {
  /* computed */

  get computedLabelClassName() {
    return {
      "nsw-form__label": true,
      "nsw-form__required": this.required
    };
  }

  /* methods */

  @api setCustomValidation(message) {
    super.setCustomValidation(message);
    this.dateEl.setCustomValidation(message);
  }

  @api sfGpsDsClearCustomValidation() {
    super.sfGpsDsClearCustomValidation();
    this.dateEl.sfGpsDsClearCustomValidation();
  }

  /* lifecycle */

  render() {
    return tmpl;
  }
}
