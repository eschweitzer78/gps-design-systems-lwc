/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import OmnistudioTextarea from "c/sfGpsDsOmniTextarea";
import StatusHelperMixin from "c/sfGpsDsAuQldStatusHelperMixin";
import tmpl from "./sfGpsDsAuQldTextarea.html";

export default class extends StatusHelperMixin(OmnistudioTextarea) {
  /* computed */

  get computedTextAreaClassName() {
    return {
      "qld__text-input": true,
      "qld__text-input--block": true,
      "qld__text-input--error": this.sfGpsDsIsError
    };
  }

  /* methods */

  @api setValue(value) {
    super.setValue(value);
  }

  /* lifecycle */

  render() {
    return tmpl;
  }
}
