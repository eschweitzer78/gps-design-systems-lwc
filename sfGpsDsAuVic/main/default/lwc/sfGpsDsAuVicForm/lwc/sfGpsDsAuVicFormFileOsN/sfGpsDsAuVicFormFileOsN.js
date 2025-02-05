/*
 * Copyright (c) 2022-2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import SfGpsDsFormFileOsN from "c/sfGpsDsFormFileOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuVicFormFileOsN.html";

// TODO: there is seemingly a bug in SDLS when the hover colors for neutral buttons are not derived from variables
//       raise with appropriate team.
//       could be fixed holistically for Experience Cloud on community css override though
// .slds-scope .slds-button_neutral:hover, .slds-scope .slds-button_neutral:focus, .slds-scope .slds-button--neutral:hover, .slds-scope .slds-button--neutral:focus {
//  background-color: rgb(243, 243, 243); -> var(--slds-c-button-neutral-color-background-hover)
//  border-color: rgb(201, 201, 201); -> var(--slds-c-button-neutral-color-border-hover)

export default class extends SfGpsDsFormFileOsN {
  get computedFormGroupClassName() {
    return computeClass({
      "form-group": true,
      invalid: this._showValidation,
      valid: !this._showValidation,
      required: this._propSetMap.required
    });
  }

  get computedAriaDescribedBy() {
    return [
      this.template.querySelector(".hint")?.id,
      this.template.querySelector(".help-block")?.id
    ]
      .filter((item) => item)
      .join(" ");
  }

  /* lifecycle */

  render() {
    return tmpl;
  }
}
