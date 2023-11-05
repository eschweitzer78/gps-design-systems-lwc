/*
 * Copyright (c) 2022-2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmniscriptMaskedInput from "c/sfGpsDsOmniMaskedInputOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuNswSMaskedInputOsN.html";

export default class SfGpsDsAuNswSMaskedInputOsN extends OmniscriptMaskedInput {
  @api useLegend = false; /* not used from omni, so it's a default value */

  render() {
    return tmpl;
  }

  get helperId() {
    return "helper";
  }

  get computedLegendClassName() {
    return "";
  }

  get computedLabelClassName() {
    return computeClass({
      "form-required": this.required
    });
  }

  get computedInputClassName() {
    return computeClass({
      "nsw-form__text": true,
      "nsw-form__number": true,
      error: this.sfGpsDsIsError
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
    return [
      this.template.querySelector(".form__help")?.id,
      this.template.querySelector(".form__error")?.id
    ]
      .filter((item) => item)
      .join(" ");
  }
}
