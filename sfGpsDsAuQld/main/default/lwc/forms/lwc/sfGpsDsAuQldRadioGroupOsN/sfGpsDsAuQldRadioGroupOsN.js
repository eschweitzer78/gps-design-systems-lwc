/*
 * Copyright (c) 2024, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmnistudioRadioGroup from "c/sfGpsDsOmniRadioGroupOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import StatusHelperMixin from "c/sfGpsDsAuQldStatusHelperMixinOsN";
import tmpl from "./sfGpsDsAuQldRadioGroupOsN.html";

export default class extends StatusHelperMixin(OmnistudioRadioGroup) {
  /* computed */

  get computedInputClassName() {
    return computeClass({
      "qld__control-input__input": true,
      "qld__control-input--block": true,
      "qld__input--error": this.sfGpsDsIsError
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