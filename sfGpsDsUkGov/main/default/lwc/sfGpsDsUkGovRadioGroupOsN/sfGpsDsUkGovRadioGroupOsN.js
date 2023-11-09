/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmnistudioRadioGroup from "c/sfGpsDsOmniRadioGroupOsN";
import SfGpsDsUkGovLabelMixin from "c/sfGpsDsUkGovLabelMixinOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsUkGovRadioGroupOsN.html";

export default class SfGpsDsUkGovRadioGroupOsN extends SfGpsDsUkGovLabelMixin(
  OmnistudioRadioGroup
) {
  render() {
    return tmpl;
  }

  renderedCallback() {
    /* parent makes a few assumptions on markup which we circumvent by not calling parent method */
  }

  get computedFormGroupClassName() {
    return computeClass({
      "govuk-form-group": true,
      "govuk-form-group--error": this.sfGpsDsIsError
    });
  }

  get computedAriaInvalid() {
    return this.sfGpsDsIsError;
  }

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.sfGpsDsIsError
    });
  }

  get computedRadiosClass() {
    return computeClass({
      "govuk-radios": true,
      "govuk-radios--inline": this.alignment === "horizontal"
    });
  }
}
