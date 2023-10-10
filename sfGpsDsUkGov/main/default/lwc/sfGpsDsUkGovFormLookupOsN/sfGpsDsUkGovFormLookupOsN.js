/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmniscriptLookup from "omnistudio/omniscriptLookup";
import SfGpsDsUkGovLabelMixin from "c/sfGpsDsUkGovLabelMixinOsN";
import { omniGetMergedField } from "c/sfGpsDsOmniHelpersOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsUkGovFormLookupOsN.html";

export default class SfGpsDsUkGovFormLookupOsN extends SfGpsDsUkGovLabelMixin(
  OmniscriptLookup,
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

  get computedLookUpInputError() {
    return computeClass({
      "govuk-input": true,
      lookup: true,
      "govuk-input--error": this.isError
    });
  }

  get computedAriaInvalid() {
    return this.isError;
  }

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this._handleHelpText,
      errorMessageBlock: this.isError
    });
  }

  get mergedLabel() {
    return omniGetMergedField(this, this._propSetMap.label);
  }

  get mergedHelpText() {
    return omniGetMergedField(this, this._handleHelpText);
  }

  get _errorMessage() {
    return this.errorMessage?.replace("Error: ", "");
  }
}
