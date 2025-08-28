/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmniscriptMaskedInput from "c/sfGpsDsOmniMaskedInputOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuVic2MaskedInputOsN.html";

export default class extends OmniscriptMaskedInput {
  @api inputClassName;

  /* computed */

  get computedInputClassName() {
    return {
      "rpl-form__input": true,
      "rpl-form__input--default": true,
      "rpl-form__input--disabled": this.disabled,
      "rpl-form__input--invalid": this.sfGpsDsIsError,
      "rpl-form__input--with-prefix-icon": false,
      "rpl-form__input--with-suffix-icon": false,
      [this.inputClassName]: this.inputClassName
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
    return [
      this.template.querySelector(".rpl-form-validation-error")?.id,
      this.template.querySelector(".rpl-form-help")?.id
    ]
      .filter((item) => item)
      .join(" ");
  }

  /* lifecycle */

  render() {
    return tmpl;
  }
}
