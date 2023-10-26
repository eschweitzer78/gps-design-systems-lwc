/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api, track } from "lwc";
import SfGpsDsFormFileOsN from "c/sfGpsDsFormFileOsN";
import SfGpsDsUkGovLabelMixin from "c/sfGpsDsUkGovLabelMixinOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsUkGovFormFileOsN.html";

const DEBUG = false;

// TODO: there is seemingly a bug in SDLS when the hover colors for neutral buttons are not derived from variables
//       raise with appropriate team.
//       could be fixed holistically for Experience Cloud on community css override though
// .slds-scope .slds-button_neutral:hover, .slds-scope .slds-button_neutral:focus, .slds-scope .slds-button--neutral:hover, .slds-scope .slds-button--neutral:focus {
//  background-color: rgb(243, 243, 243); -> var(--slds-c-button-neutral-color-background-hover)
//  border-color: rgb(201, 201, 201); -> var(--slds-c-button-neutral-color-border-hover)

const DEFAULT_LABEL_SIZE = "large";

export default class SfGpsDsUkGovFormFileOsN extends SfGpsDsUkGovLabelMixin(
  SfGpsDsFormFileOsN,
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

  get computedFileUploadError() {
    return computeClass({
      "govuk-file-upload--error": this.isError
    });
  }

  @track computedAriaDescribedBy;

  renderedCallback() {
    if (super.renderedCallback) super.renderedCallback();

    this.computedAriaDescribedBy = [
      this.template.querySelector(".govuk-hint")?.id,
      this.template.querySelector(".govuk-error-message")?.id
    ]
      .filter((item) => item)
      .join(" ");
  }

  @api
  getErrorDetails() {
    let rv = null;
    let elt = this.template.querySelector(".govuk-form-group");

    if (elt == null) {
      if (DEBUG) console.log("sfGpsDsUkGovFormFile: cannot find input element");
    }

    rv =
      elt && this._showValidation
        ? {
            id: elt.id,
            errorMessage: this._errorMessage
          }
        : null;

    return rv;
  }

  @api scrollTo() {
    const input = this.template.querySelector(".govuk-form-group");
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
