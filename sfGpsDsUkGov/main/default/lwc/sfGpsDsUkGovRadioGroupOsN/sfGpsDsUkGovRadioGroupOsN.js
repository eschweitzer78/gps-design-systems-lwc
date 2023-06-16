/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmnistudioRadioGroup from "omnistudio/radioGroup";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsUkGovRadioGroupOsN.html";

const errorSrLabel = "Error: ";

export default class SfGpsDsUkGovRadioGroupOsN extends OmnistudioRadioGroup {
  render() {
    return tmpl;
  }

  renderedCallback() {
    /* parent makes a few assumptions on markup which we circumvent */
  }

  get computedLegendClassName() {
    return computeClass({
      "govuk-fieldset__legend": true,
      "govuk-fieldset__legend--l": true
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

  get computedFormGroupClassName() {
    return computeClass({
      "govuk-form-group": true,
      "govuk-form-group--error": this.isError
    });
  }

  get computedRadiosClass() {
    return (
      "govuk-radios" +
      (this.alignment === "horizontal" ? " govuk-radios--inline" : "")
    );
  }

  get errorSrLabel() {
    return errorSrLabel;
  }

  @api reportValidity() {
    let r = super.reportValidity();
    console.log("reportValidity", r, this.errorMessage);
    return r;
  }

  @api checkValidity() {
    let r = super.checkValidity();
    console.log("checkValidity", r, this.errorMessage);
    return r;
  }

  @api getErrorDetails() {
    let elt = this.template.querySelector(".govuk-form-group");

    return elt
      ? {
          id: elt.id,
          errorMessage: this.errorMessage
        }
      : null;
  }

  @api scrollTo() {
    console.log("scrollTo called v2!");
  }
}
