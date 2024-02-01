/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { track } from "lwc";
import SfGpsDsFormFileOsN from "c/sfGpsDsFormFileOsN";
import SfGpsDsUkGovLabelMixin from "c/sfGpsDsUkGovLabelMixinOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsUkGovFormFileOsN.html";

// TODO: there is seemingly a bug in SDLS when the hover colors for neutral buttons are not derived from variables
//       raise with appropriate team.
//       could be fixed holistically for Experience Cloud on community css override though
// .slds-scope .slds-button_neutral:hover, .slds-scope .slds-button_neutral:focus, .slds-scope .slds-button--neutral:hover, .slds-scope .slds-button--neutral:focus {
//  background-color: rgb(243, 243, 243); -> var(--slds-c-button-neutral-color-background-hover)
//  border-color: rgb(201, 201, 201); -> var(--slds-c-button-neutral-color-border-hover)

export default class SfGpsDsUkGovFormFileOsN extends SfGpsDsUkGovLabelMixin(
  SfGpsDsFormFileOsN
) {
  render() {
    return tmpl;
  }

  initCompVariables() {
    super.initCompVariables();

    this.labelSize = this._propSetMap.labelSize;
    this.isHeading = this._propSetMap.isHeading;
  }

  get computedFormGroupClassName() {
    return computeClass({
      "govuk-form-group": true,
      "govuk-form-group--error": this.sfGpsDsIsError
    });
  }

  /*  Based on the current lightning-file-upload this
      can't really be applied but it visually does not
      matter
   */

  get computedInputClassName() {
    return computeClass({
      "govuk-file-upload": true,
      "govuk-file-upload--error": this.sfGpsDsIsError
    });
  }

  get computedLabelId() {
    return "fileUpload";
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
}
