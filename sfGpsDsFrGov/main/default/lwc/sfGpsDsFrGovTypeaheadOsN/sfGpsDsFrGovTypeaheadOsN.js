/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsTypeahead from "c/sfGpsDsOmniTypeaheadOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";

import tmpl from "./sfGpsDsFrGovTypeaheadOsN.html";

export default class extends SfGpsDsTypeahead {
  render() {
    return tmpl;
  }

  get computedFormGroupClassName() {
    return computeClass({
      "fr-input-group": true,
      "fr-input-group--error": this.sfGpsDsIsError
    });
  }

  get computedInputClassName() {
    return computeClass({
      "fr-input": true,
      typeahead: true,
      "fr-input--error": this.sfGpsDsIsError
    });
  }

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.sfGpsDsIsError
    });
  }
}
