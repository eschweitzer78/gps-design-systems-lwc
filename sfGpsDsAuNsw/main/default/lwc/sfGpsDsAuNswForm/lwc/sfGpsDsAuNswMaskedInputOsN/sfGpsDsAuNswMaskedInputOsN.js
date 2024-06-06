/*
 * Copyright (c) 2022-2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmniscriptMaskedInput from "c/sfGpsDsOmniMaskedInputOsN";
import StatusHelperMixin from "c/sfGpsDsAuNswStatusHelperMixinOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";

import tmpl from "./sfGpsDsAuNswMaskedInputOsN.html";

export default class SfGpsDsAuNswMaskedInputOsN extends StatusHelperMixin(
  OmniscriptMaskedInput
) {
  render() {
    return tmpl;
  }

  get computedLabelClassName() {
    return computeClass({
      "nsw-form__label": true,
      "nsw-form__required": this.required
    });
  }

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.sfGpsDsIsError
    });
  }

  /* original maskedInput widget does a JS update of aria-describedby when validating */

  resolveAriaDescribedBy() {
    return [...this.template.querySelectorAll(".nsw-form__helper")]
      ?.map((item) => item.id)
      .join(" ");
  }
}
