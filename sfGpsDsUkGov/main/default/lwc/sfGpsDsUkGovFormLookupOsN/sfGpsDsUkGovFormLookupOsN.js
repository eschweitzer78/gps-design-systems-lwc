/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormLookupOsN from "c/sfGpsDsFormLookupOsN";
import SfGpsDsUkGovLabelMixin from "c/sfGpsDsUkGovLabelMixinOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsUkGovFormLookupOsN.html";

export default class extends SfGpsDsUkGovLabelMixin(SfGpsDsFormLookupOsN) {
  initCompVariables() {
    super.initCompVariables();

    this.labelSize = this._propSetMap.labelSize;
    this.isHeading = this._propSetMap.isHeading;
  }

  /* computed */

  get computedFormGroupClassName() {
    return computeClass({
      "govuk-form-group": true,
      "govuk-form-group--error": this.sfGpsDsIsError
    });
  }

  get computedInputClassName() {
    return {
      "govuk-input": true,
      "govuk-input--error": this.sfGpsDsIsError,
      "sfgpsds-input": true,
      "sfgpsds-combobox__input": true
    };
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

  /* lifecycle */

  render() {
    return tmpl;
  }
}
