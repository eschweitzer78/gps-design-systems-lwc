/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmnistudioRadioGroup from "c/sfGpsDsOmniRadioGroup";
import { computeClass } from "c/sfGpsDsHelpers";
import tmpl from "./sfGpsDsCaOnFormRadio.html";

export default class SfGpsDsCaOnFormRadio extends OmnistudioRadioGroup {
  @api readOnly;

  /* computed */

  get computedLegendClassName() {
    return {
      "ontario-fieldset__legend": true,
      "ontario-fieldset__legend--required": this.required
    };
  }

  get computedAriaInvalid() {
    return this.sfGpsDsIsError;
  }

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.sfGpsDsIsError
    });
  }

  get computedDisabledOrReadOnly() {
    return this.disabled || this.readOnly;
  }

  /* lifecycle */

  render() {
    return tmpl;
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }

    this.classList.add("caon-scope");
  }
}
