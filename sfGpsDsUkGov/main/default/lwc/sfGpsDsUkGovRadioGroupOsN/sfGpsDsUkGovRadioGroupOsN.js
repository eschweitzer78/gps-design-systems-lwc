/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmnistudioRadioGroup from "omnistudio/radioGroup";
import SfGpsDsUkGovLabelMixin from "c/sfGpsDsUkGovLabelMixinOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsUkGovRadioGroupOsN.html";

const ERROR_SR_LABEL = "Error: ";

export default class SfGpsDsUkGovRadioGroupOsN extends SfGpsDsUkGovLabelMixin(
  OmnistudioRadioGroup,
  "large"
) {
  render() {
    return tmpl;
  }

  renderedCallback() {
    /* parent makes a few assumptions on markup which we circumvent by not calling parent method */
  }

  get computedFormGroupClassName() {
    return computeClass({
      "govuk-form-group": true,
      "govuk-form-group--error": this.isError
    });
  }

  get computedAriaInvalid() {
    return this.isError;
  }

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.isError
    });
  }

  get computedRadiosClass() {
    return computeClass({
      "govuk-radios": true,
      "govuk-radios--inline": this.alignment === "horizontal"
    });
  }

  get errorSrLabel() {
    return ERROR_SR_LABEL;
  }

  @api reportValidity() {
    return super.reportValidity();
  }

  @api checkValidity() {
    return super.checkValidity();
  }

  @api getErrorDetails() {
    let elt = this.template.querySelector(".govuk-form-group");

    return elt
      ? {
          id: elt.id,
          errorMessage: this._errorMessage
        }
      : null;
  }

  get _errorMessage() {
    return this.errorMessage?.replace("Error: ", "");
  }
}
