/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmnistudioTypeahead from "omnistudio/typeahead";
import SfGpsDsUkGovLabelMixin from "c/sfGpsDsUkGovLabelMixinOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";

import tmpl from "./sfGpsDsUkGovTypeaheadOsN.html";

export default class SfGpsDsUkGovTypeaheadOs extends SfGpsDsUkGovLabelMixin(
  OmnistudioTypeahead,
  "large"
) {
  /* TODO: handle
    messageWhenValueMissing
    messageWhenTooLong
    messageWhenTooShort
  */

  render() {
    return tmpl;
  }

  get computedFormGroupClassName() {
    return computeClass({
      "govuk-form-group": true,
      "govuk-form-group--error": this.isError
    });
  }

  get computedTypeAheadInputError() {
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
}
