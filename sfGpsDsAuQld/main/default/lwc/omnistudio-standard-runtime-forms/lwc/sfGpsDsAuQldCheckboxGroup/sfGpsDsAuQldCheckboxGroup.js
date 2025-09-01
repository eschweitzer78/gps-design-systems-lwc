/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmnistudioCheckboxGroup from "c/sfGpsDsOmniCheckboxGroup";
import StatusHelperMixin from "c/sfGpsDsAuQldStatusHelperMixin";
import tmpl from "./sfGpsDsAuQldCheckboxGroup.html";

export default class extends StatusHelperMixin(OmnistudioCheckboxGroup) {
  /* computed */

  get computedInputClassName() {
    return {
      "qld__control-input__input": true,
      "qld__input--error": this.sfGpsDsIsError
    };
  }

  /* lifecycle */

  render() {
    return tmpl;
  }
}
