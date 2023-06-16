/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmnistudioTextarea from "omnistudio/textarea";
import SfGpsDsUkGovLabelMixin from "c/sfGpsDsUkGovLabelMixinOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsUkGovTextareaOsN.html";

export default class SfGpsDsUkGovTextareaOsN extends SfGpsDsUkGovLabelMixin(
  OmnistudioTextarea,
  "large"
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

  get computedTextAreaError() {
    return computeClass({
      "govuk-textarea": true,
      "govuk-textarea--error": this.isError
    });
  }

  get computedAriaDescribedBy() {
    return computeClass({
      textarealabel: true,
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.isError
    });
  }
}
