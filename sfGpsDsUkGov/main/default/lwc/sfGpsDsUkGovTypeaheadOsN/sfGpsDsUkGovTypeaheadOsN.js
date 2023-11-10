/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsTypeahead from "c/sfGpsDsOmniTypeaheadOsN";
import SfGpsDsUkGovLabelMixin from "c/sfGpsDsUkGovLabelMixinOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsUkGovTypeaheadOsN.html";

export default class SfGpsDsUkGovTypeaheadOs extends SfGpsDsUkGovLabelMixin(
  SfGpsDsTypeahead
) {
  render() {
    return tmpl;
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
      "govuk-input--error": this.sfGpsDsIsError,
      "sfgpsds-input": true,
      "sfgpsds-combobox__input": true
    });
  }

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.sfGpsDsIsError
    });
  }

  @api
  get validationMessage() {
    const rv = this.sfGpsDsErrorMessage;
    return rv;
  }
}
