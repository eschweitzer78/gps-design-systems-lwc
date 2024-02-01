/*
 * Copyright (c) 2022-2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmnistudioRadioGroup from "c/sfGpsDsOmniRadioGroupOsN";
import StatusHelperMixin from "c/sfGpsDsAuNswStatusHelperMixinOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuNswRadioGroupOsN.html";

export default class SfGpsDsAuNswRadioGroupOsN extends StatusHelperMixin(
  OmnistudioRadioGroup
) {
  /* computed */

  get computedLegendClassName() {
    return computeClass({
      "nsw-form__legend": true,
      "nsw-form__required": this.required
    });
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

  /* lifecycle */

  render() {
    return tmpl;
  }

  renderedCallback() {
    // Fixing issue #19
  }
}
