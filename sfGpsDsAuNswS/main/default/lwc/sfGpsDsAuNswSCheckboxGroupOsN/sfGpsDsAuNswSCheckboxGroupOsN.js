/*
 * Copyright (c) 2022-2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmnistudioCheckboxGroup from "c/sfGpsDsOmniCheckboxGroupOsN";
import tmpl from "./sfGpsDsAuNswSCheckboxGroupOsN.html";
import { computeClass } from "c/sfGpsDsHelpersOs";

export default class SfGpsDsAuNswNCheckboxGroupOsN extends OmnistudioCheckboxGroup {
  render() {
    return tmpl;
  }

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.sfGpsDsIsError
    });
  }

  get computedLegendClassName() {
    return computeClass({
      "form-required": this.required
    });
  }

  get computedInputClassName() {
    return computeClass({
      error: this.sfGpsDsIsError
    });
  }
}
