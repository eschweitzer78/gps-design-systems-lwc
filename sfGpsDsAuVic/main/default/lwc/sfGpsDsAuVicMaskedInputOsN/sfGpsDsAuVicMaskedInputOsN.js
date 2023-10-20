/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import maskedInput from "omnistudio/maskedInput";
import { computeClass } from "c/sfGpsDsHelpersOs";

import tmpl from "./sfGpsDsAuVicMaskedInputOsN.html";

export default class SfGpsDsAuVicMaskedInputOsN extends maskedInput {
  render() {
    return tmpl;
  }

  get computedFormGroupClassName() {
    return computeClass({
      "form-group": true,
      valid: !this.isError,
      invalid: this.isError,
      required: this.required
    });
  }

  get showGrid() {
    return this.static || this.inlineHelp;
  }

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.isError
    });
  }

  /* original maskedInput widget does a JS update of aria-describedby when validating */

  resolveAriaDescribedBy() {
    return [
      this.template.querySelector(".hint")?.id,
      this.template.querySelector(".help-block")?.id
    ]
      .filter((item) => item)
      .join(" ");
  }
}
