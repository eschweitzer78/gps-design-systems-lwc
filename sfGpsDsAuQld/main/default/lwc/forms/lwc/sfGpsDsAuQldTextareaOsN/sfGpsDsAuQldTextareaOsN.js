/*
 * Copyright (c) 2024, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmnistudioTextarea from "c/sfGpsDsOmniTextareaOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import StatusHelperMixin from "c/sfGpsDsAuQldStatusHelperMixinOsN";
import tmpl from "./sfGpsDsAuQldTextareaOsN.html";

export default class extends StatusHelperMixin(OmnistudioTextarea) {
  render() {
    return tmpl;
  }

  get computedTextAreaClassName() {
    return computeClass({
      "qld__text-input": true,
      "qld__text-input--block": true,
      "qld__text-input--error": this.sfGpsDsIsError
    });
  }
}
