/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import OmniscriptFile from "omnistudio/omniscriptFile";
import { omniGetMergedField } from "c/sfGpsDsOmniHelpersOsN";
import SfGpsDsUkGovLabelMixin from "c/sfGpsDsUkGovLabelMixinOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsUkGovFormFileUploadOsN.html";

// TODO: there is seemingly a bug in SDLS when the hover colors for neutral buttons are not derived from variables
//       raise with appropriate team.
//       could be fixed holistically for Experience Cloud on community css override though
// .slds-scope .slds-button_neutral:hover, .slds-scope .slds-button_neutral:focus, .slds-scope .slds-button--neutral:hover, .slds-scope .slds-button--neutral:focus {
//  background-color: rgb(243, 243, 243); -> var(--slds-c-button-neutral-color-background-hover)
//  border-color: rgb(201, 201, 201); -> var(--slds-c-button-neutral-color-border-hover)

export default class SfGpsDsUkGovFormFileUploadOsN extends SfGpsDsUkGovLabelMixin(
  OmniscriptFile,
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

  get computedLabelClassName() {
    return computeClass({
      "govuk-label": true
    });
  }

  get computedFileUploadError() {
    return computeClass({
      "govuk-file-upload--error": this.isError
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
