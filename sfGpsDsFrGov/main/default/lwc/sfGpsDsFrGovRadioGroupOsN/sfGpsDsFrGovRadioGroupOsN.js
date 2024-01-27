/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmnistudioRadioGroup from "c/sfGpsDsOmniRadioGroupOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsFrGovRadioGroupOsN.html";

export default class extends OmnistudioRadioGroup {
  @api sfGpsDsRadioSize = "default";
  @api readOnly;

  get computedFormGroupClassName() {
    return computeClass({
      "fr-fieldset": true,
      "fr-fieldset--error": this.sfGpsDsIsError
    });
  }

  get computedRadioGroupClassName() {
    return computeClass({
      "fr-radio-group": true,
      "fr-radio-group--small": this.sfGpsDsRadioSize === "small"
    });
  }

  get computedFieldsetClassName() {
    return computeClass({
      "fr-fieldset__element": true,
      "fr-fieldset__element--inline": this.alignment === "horizontal"
    });
  }

  get computedLabelClass() {
    return computeClass({
      "fr-label": true,
      "fr-label--disabled": this.readOnly
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

  get _errorMessage() {
    return this.sfGpsDsErrorMessage?.replace("Error:", "");
  }

  /* lifecycle */

  render() {
    return tmpl;
  }

  renderedCallback() {
    /* Fixing issue #19 parent makes a few assumptions on markup which we circumvent by not calling parent method */
  }
}
