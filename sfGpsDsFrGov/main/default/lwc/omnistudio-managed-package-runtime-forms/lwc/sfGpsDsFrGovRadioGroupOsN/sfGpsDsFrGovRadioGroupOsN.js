/*
 * Copyright (c) 2023-2024, Bouchra Mouhim, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
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

  /* computed */

  get computedFormGroupClassName() {
    return {
      "fr-fieldset": true,
      "fr-fieldset--error": this.sfGpsDsIsError
    };
  }

  get computedRadioGroupClassName() {
    return {
      "fr-radio-group": true,
      "fr-radio-group--small": this.sfGpsDsRadioSize === "small"
    };
  }

  get computedFieldsetClassName() {
    return {
      "fr-fieldset__element": true,
      "fr-fieldset__element--inline": this.alignment === "horizontal"
    };
  }

  get computedLabelClassName() {
    return {
      "fr-label": true
    };
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

  get computedDisabledReadOnly() {
    return this.disabled || this.readOnly;
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
