/*
 * Copyright (c) 2023-2024, Bouchra Mouhim, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsFormLookupOsN from "c/sfGpsDsFormLookupOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsFrGovFormLookupOsN.html";

export default class SfGpsDsFrGovFormLookupOsN extends SfGpsDsFormLookupOsN {
  @api disabled;
  @api readOnly;

  render() {
    return tmpl;
  }

  get computedFormGroupClassName() {
    return computeClass({
      "fr-select-group": true,
      "fr-select-group--error": this.sfGpsDsIsError,
      "fr-select-group--disabled": this.readOnly
    });
  }

  get computedLabelClassName() {
    return computeClass({
      "fr-label": true,
      "fr-label--disabled": this.readOnly
    });
  }

  get computedInputClassName() {
    return computeClass({
      "fr-input": true,
      "fr-input--error": this.sfGpsDsIsError,
      "sfgpsds-input": true,
      "sfgpsds-combobox__input": true
    });
  }

  get computedAriaInvalid() {
    return this.sfGpsDsIsError;
  }

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this._handleHelpText,
      errorMessageBlock: this.sfGpsDsIsError
    });
  }
}
