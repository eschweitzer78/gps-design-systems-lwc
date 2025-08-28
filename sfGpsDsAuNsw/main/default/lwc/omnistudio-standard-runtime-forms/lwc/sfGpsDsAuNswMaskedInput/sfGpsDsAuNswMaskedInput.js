/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmniscriptMaskedInput from "c/sfGpsDsOmniMaskedInput";
import StatusHelperMixin from "c/sfGpsDsAuNswStatusHelperMixin";
import { computeClass } from "c/sfGpsDsHelpers";

import tmpl from "./sfGpsDsAuNswMaskedInput.html";

export default class SfGpsDsAuNswMaskedInputOsN extends StatusHelperMixin(
  OmniscriptMaskedInput
) {
  /* computed */

  get computedLabelClassName() {
    return {
      "nsw-form__label": true,
      "nsw-form__required": this.required
    };
  }

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.sfGpsDsIsError
    });
  }

  /* methods */
  /* original maskedInput widget does a JS update of aria-describedby when validating */

  resolveAriaDescribedBy() {
    return [...this.template.querySelectorAll(".nsw-form__helper")]
      ?.map((item) => item.id)
      .join(" ");
  }

  /* lifecycle */

  render() {
    return tmpl;
  }
}
