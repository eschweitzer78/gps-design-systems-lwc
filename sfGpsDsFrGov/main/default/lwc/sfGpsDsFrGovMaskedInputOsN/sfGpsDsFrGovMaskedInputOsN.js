/*
 * Copyright (c) 2023-2024, Bouchra Mouhim, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmniscriptMaskedInput from "c/sfGpsDsOmniMaskedInputOsN";
import tmpl from "./sfGpsDsFrGovMaskedInputOsN.html";

export default class extends OmniscriptMaskedInput {
  /* computed */

  get computedFormGroupClassName() {
    return {
      "fr-input-group": true,
      "fr-input-group--error": this.sfGpsDsIsError,
      "fr-input-group--disabled": this.readOnly
    };
  }

  get computedLabelClassName() {
    return {
      "fr-label": true
    };
  }

  get computedInputClassName() {
    return {
      "fr-input": true,
      "fr-input--error": this.sfGpsDsIsError
    };
  }

  get _errorMessage() {
    return this.sfGpsDsErrorMessage?.replace("Error:", "");
  }

  /* methods */
  /* original maskedInput widget does a JS update of aria-describedby when validating */

  resolveAriaDescribedBy() {
    return [
      this.template.querySelector(".fr-hint-text")?.id,
      this.template.querySelector(".fr-error-text")?.id
    ]
      .filter((item) => item)
      .join(" ");
  }

  /* lifecycle */

  render() {
    return tmpl;
  }
}
