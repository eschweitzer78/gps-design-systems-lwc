/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmniscriptMaskedInput from "c/sfGpsDsOmniMaskedInputOsN";
import SfGpsDsUkGovLabelMixin from "c/sfGpsDsUkGovLabelMixinOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";

import tmpl from "./sfGpsDsUkGovMaskedInputOsN.html";

export default class SfGpsDsUkGovMaskedInputOsN extends SfGpsDsUkGovLabelMixin(
  OmniscriptMaskedInput
) {
  /* api: prefix and suffix */

  @api sfGpsDsPrefix;
  @api sfGpsDsSuffix;

  /* methods */

  render() {
    return tmpl;
  }

  /* getters */

  get computedHasPrefixOrSuffix() {
    return this.sfGpsDsPrefix || this.sfGpsDsSuffix;
  }

  get computedFormGroupClassName() {
    return computeClass({
      "govuk-form-group": true,
      "govuk-form-group--error": this.sfGpsDsIsError
    });
  }

  get computedInputClassName() {
    return computeClass({
      "govuk-input": true,
      "govuk-input--error": this.sfGpsDsIsError
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
      this.template.querySelector(".govuk-hint")?.id,
      this.template.querySelector(".govuk-error-message")?.id
    ]
      .filter((item) => item)
      .join(" ");
  }
}
