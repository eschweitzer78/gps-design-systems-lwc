/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsFormLookup from "c/sfGpsDsFormLookupOsN";
import SfGpsDsUkGovLabelMixin from "c/sfGpsDsUkGovLabelMixinOsN";
import { omniGetMergedField } from "c/sfGpsDsOmniHelpersOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsUkGovFormLookupOsN.html";

const DEFAULT_LABEL_SIZE = "large";
const DEBUG = false;

export default class SfGpsDsUkGovFormLookupOsN extends SfGpsDsUkGovLabelMixin(
  SfGpsDsFormLookup,
  DEFAULT_LABEL_SIZE
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

  get computedInputClassName() {
    return computeClass({
      "govuk-input": true,
      "govuk-input--error": this.isError,
      "sfgpsds-input": true,
      "sfgpsds-combobox__input": true
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

  get computedOptions() {
    return this.options || [];
  }

  get mergedLabel() {
    return omniGetMergedField(this, this._propSetMap.label);
  }

  get mergedHelpText() {
    return omniGetMergedField(this, this._handleHelpText);
  }

  @api getErrorDetails() {
    let elt = this.template.querySelector("[data-omni-input]");

    if (elt) {
      if (elt.getErrorDetails) {
        return elt.getErrorDetails();
      }

      if (DEBUG) console.log("child does not have getErrorDetails api");
    }

    if (DEBUG) console.log("child not found");
    return null;
  }

  @api scrollTo() {
    const input = this.template.querySelector("[data-omni-input]");
    input.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest"
    });
  }

  get _errorMessage() {
    return this.errorMessage?.replace("Error: ", "");
  }
}
