/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmniscriptInput from "omnistudio/input";
import SfGpsDsUkGovLabelMixin from "c/sfGpsDsUkGovLabelMixinOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsUkGovInputOsN.html";

const ERROR_ID_SELECTOR = "[omni-input]";

export default class SfGpsDsUkGovInputOsN extends SfGpsDsUkGovLabelMixin(
  OmniscriptInput,
  "large"
) {
  render() {
    return tmpl;
  }

  initOptions() {
    super.initOptions();

    switch (this._innerElement) {
      case "c-time-picker":
        this._innerElement = "c-sf-gps-ds-uk-gov-time-picker-os-n";
        break;

      case "c-date-picker":
        this._innerElement = "c-sf-gps-ds-uk-gov-date-picker-os-n";
        break;

      case "c-datetime-picker":
        this._innerElement = "c-sf-gps-ds-uk-gov-datetime-picker-os-n";
        break;

      default:
    }
  }

  get computedFormGroupClassName() {
    return computeClass({
      "govuk-form-group": true,
      "govuk-form-group--error": this.isError
    });
  }

  get computedInputError() {
    return computeClass({
      "govuk-input": true,
      "govuk-input--error": this.isError
    });
  }

  @api getErrorDetails() {
    let elt = this.template.querySelector(ERROR_ID_SELECTOR);

    if (this.isCustomLwc) {
      if (elt.getErrorDetails) {
        return elt.getErrorDetails();
      }
      console.log("child input does not have getErrorDetails");
      return null;
    }

    return elt
      ? {
          id: elt.id,
          errorMessage: this.errorMessage
        }
      : null;
  }
}
