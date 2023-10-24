/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmniscriptMaskedInput from "omnistudio/maskedInput";
import SfGpsDsUkGovLabelMixin from "c/sfGpsDsUkGovLabelMixinOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";

import tmpl from "./sfGpsDsUkGovMaskedInputOsN.html";

const ERROR_ID_SELECTOR = "[data-sf-gps-uk-gov-error-input]";
const DEFAULT_LABEL_SIZE = "large";

export default class SfGpsDsUkGovMaskedInputOsN extends SfGpsDsUkGovLabelMixin(
  OmniscriptMaskedInput,
  DEFAULT_LABEL_SIZE
) {
  render() {
    return tmpl;
  }

  get computedFormGroupClassName() {
    return computeClass({
      "govuk-form-group": true,
      "govuk-form-group--error": this.isError
    });
  }

  get computedInputClassName() {
    return computeClass({
      "govuk-input": true,
      "govuk-input--error": this.isError
    });
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
      this.template.querySelector(".govuk-hint")?.id,
      this.template.querySelector(".govuk-error-message")?.id
    ]
      .filter((item) => item)
      .join(" ");
  }

  @api getErrorDetails() {
    let elt = this.template.querySelector(ERROR_ID_SELECTOR);

    return elt
      ? {
          id: elt.id,
          errorMessage: this._errorMessage
        }
      : null;
  }

  get _errorMessage() {
    return this.errorMessage?.replace("Error: ", "");
  }
}
