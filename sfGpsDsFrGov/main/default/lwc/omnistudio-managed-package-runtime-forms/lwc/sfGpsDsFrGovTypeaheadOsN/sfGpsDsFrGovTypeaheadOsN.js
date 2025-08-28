/*
 * Copyright (c) 2023-2024, Bouchra Mouhim, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsTypeahead from "c/sfGpsDsOmniTypeaheadOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsFrGovTypeaheadOsN.html";

export default class extends SfGpsDsTypeahead {
  /* computed */

  get computedFormGroupClassName() {
    return {
      "fr-input-group": true,
      "fr-input-group--disabled": this.disabled || this.readOnly,
      "fr-input-group--error": this.sfGpsDsIsError
    };
  }

  get computedInputClassName() {
    return {
      "fr-input": true,
      typeahead: true,
      "fr-input--error": this.sfGpsDsIsError
    };
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

  @api
  get validationMessage() {
    const rv = this.sfGpsDsErrorMessage;
    return rv;
  }

  /* lifecycle */

  render() {
    return tmpl;
  }
}
