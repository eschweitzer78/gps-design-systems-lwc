/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsTimePickerOsN from "c/sfGpsDsTimePickerOsN";
import SfGpsDsUkGovLabelMixin from "c/sfGpsDsUkGovLabelMixinOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsUkGovTimePickerOsN.html";

const ERROR_ID_SELECTOR = "[data-sf-gps-uk-gov-error-input]";
const DEBUG = false;

export default class SfGpsDsUkGovTimePickerOsN extends SfGpsDsUkGovLabelMixin(
  SfGpsDsTimePickerOsN,
  "large"
) {
  @api fieldLabel;

  render() {
    return tmpl;
  }

  get computedFormGroupClassName() {
    return computeClass({
      "govuk-form-group": !this.hideFormGroup,
      "govuk-form-group--error": this.isError
    });
  }

  get computedTimePickerInputError() {
    return computeClass({
      "govuk-input": true,
      "govuk-input--error": this.isError
    });
  }

  get ariaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.isError
    });
  }

  get computedInputId() {
    return "time-input";
  }

  connectedCallback() {
    super.connectedCallback();
  }

  @api
  getErrorDetails() {
    let rv = null;

    let elt = this.template.querySelector(ERROR_ID_SELECTOR);

    if (elt == null) {
      if (DEBUG)
        console.log("sfGpsDsUkGovTimePicker: cannot find input element");
    } else if (this.isCustomLwc) {
      if (elt.getErrorDetails) {
        rv = elt.getErrorDetails();
      } else {
        if (DEBUG)
          console.log(
            "sfGpsDsUkGovTimePicker: child input does not have getErrorDetails"
          );
      }
    }
    rv = elt
      ? {
          id: elt.id,
          errorMessage: this._errorMessage
        }
      : null;

    return rv;
  }

  get _errorMessage() {
    return this.errorMessage?.replace("Error: ", "");
  }
}
