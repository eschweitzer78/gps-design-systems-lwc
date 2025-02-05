/*
 * Copyright (c) 2022-2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmnistudioCheckboxGroup from "c/sfGpsDsOmniCheckboxGroupOsN";
import SfGpsDsAuNswStatusHelperMixin from "c/sfGpsDsAuNswStatusHelperMixinOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuNswCheckboxGroupOsN.html";

export default class extends SfGpsDsAuNswStatusHelperMixin(
  OmnistudioCheckboxGroup
) {
  /* computed */

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.sfGpsDsIsError
    });
  }

  get computedLegendClassName() {
    return {
      "nsw-form__legend": true,
      "nsw-form__required": this.required
    };
  }

  /* lifecycle */

  render() {
    return tmpl;
  }
}
