/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmnistudioCheckboxGroup from "omnistudio/checkboxGroup";
import tmpl from "./sfGpsDsAuNswSCheckboxGroupOsN.html";
import { computeClass } from "c/sfGpsDsHelpersOs";

export default class SfGpsDsAuNswNCheckboxGroupOsN extends OmnistudioCheckboxGroup {
  render() {
    return tmpl;
  }

  get computedAriaInvalid() {
    return this.isError;
  }

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.isError
    });
  }

  get computedLegendClassName() {
    return computeClass({
      "form-required": this.required
    });
  }

  get computedInputClassName() {
    return computeClass({
      error: this.isError
    });
  }

  get isRealError() {
    return this.isError && this.errorMessage;
  }
}
