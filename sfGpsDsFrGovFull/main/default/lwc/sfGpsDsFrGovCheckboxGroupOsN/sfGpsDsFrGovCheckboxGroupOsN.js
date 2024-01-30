/*
 * Copyright (c) 2023-2024, Bouchra Mouhim, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmniscriptCheckboxGroup from "c/sfGpsDsOmniCheckboxGroupOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsFrGovCheckboxGroupOsN.html";

export default class extends OmniscriptCheckboxGroup {
  @api sfGpsDsCheckboxSize = "default";
  @api readOnly;

  render() {
    return tmpl;
  }

  get computedFieldsetClassName() {
    return computeClass({
      "fr-fieldset": true,
      "fr-fieldset--error": this.sfGpsDsIsError
    });
  }

  get computedFieldsetElementClassName() {
    return computeClass({
      "fr-fieldset__element": true,
      "fr-fieldset__element--inline": this.alignment === "horizontal"
    });
  }

  get computedCheckboxGroupClassName() {
    return computeClass({
      "fr-checkbox-group": true,
      "fr-checkbox-group--sm": this.sfGpsDsCheckboxSize === "small"
    });
  }

  // @TODO: Refine
  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.sfGpsDsIsError
    });
  }

  get _errorMessage() {
    return this.sfGpsDsErrorMessage?.replace("Error:", "");
  }

  get computedDisabledReadOnly() {
    return this.disabled || this.readOnly;
  }
}
