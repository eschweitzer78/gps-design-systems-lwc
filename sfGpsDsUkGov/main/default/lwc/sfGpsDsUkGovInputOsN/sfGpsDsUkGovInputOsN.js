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

const ERROR_ID_SELECTOR = "[data-sf-gps-uk-gov-error-input]";
const DEBUG = false;

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
    let rv = null;
    if (DEBUG) console.log("> sfGpsDsUkGovInputOsN.getErrorDetails");

    try {
      let elt = this.template.querySelector(ERROR_ID_SELECTOR);

      if (elt == null) {
        if (DEBUG) console.log("sfGpsDsUkGovInputOsN: cannot find child input");
      } else if (this.isCustomLwc) {
        if (elt.getErrorDetails) {
          rv = elt.getErrorDetails();
        } else {
          if (DEBUG)
            console.log(
              "sfGpsDsUkGovInputOsN: child input does not have getErrorDetails"
            );
        }
      } else {
        rv = elt
          ? {
              id: elt.id,
              errorMessage: this._errorMessage
            }
          : null;
      }
    } catch (e) {
      if (DEBUG) console.log("sfGpsDsUkGovInputOsN: exception ", e);
    }

    if (DEBUG)
      console.log("< sfGpsDsUkGovInputOsN.getErrorDetails", JSON.stringify(rv));
    return rv;
  }

  get _errorMessage() {
    return this.errorMessage?.replace("Error: ", "");
  }
}
