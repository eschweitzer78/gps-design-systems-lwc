/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import OmniscriptFile from "omnistudio/omniscriptFile";
import { omniGetMergedField } from "c/sfGpsDsOmniHelpersOsN";
import { getHelperClassName, getStatusIcon } from "c/sfGpsDsAuNswFormHelperOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuNswFormFileOsN.html";

// TODO: there is seemingly a bug in SDLS when the hover colors for neutral buttons are not derived from variables
//       raise with appropriate team.
//       could be fixed holistically for Experience Cloud on community css override though
// .slds-scope .slds-button_neutral:hover, .slds-scope .slds-button_neutral:focus, .slds-scope .slds-button--neutral:hover, .slds-scope .slds-button--neutral:focus {
//  background-color: rgb(243, 243, 243); -> var(--slds-c-button-neutral-color-background-hover)
//  border-color: rgb(201, 201, 201); -> var(--slds-c-button-neutral-color-border-hover)

export default class SfGpsDsAuNswFormFileOsN extends OmniscriptFile {
  render() {
    return tmpl;
  }

  get computedLabelClassName() {
    return computeClass({
      "nsw-form__label": true,
      "nsw-form__required": this._propSetMap.required
    });
  }

  get computedHelperClassName() {
    return getHelperClassName("invalid");
  }

  get computedStatusIcon() {
    return getStatusIcon("invalid");
  }

  get mergedLabel() {
    return omniGetMergedField(this, this._propSetMap.label);
  }

  get mergedHelpText() {
    return omniGetMergedField(this, this._handleHelpText);
  }
}
