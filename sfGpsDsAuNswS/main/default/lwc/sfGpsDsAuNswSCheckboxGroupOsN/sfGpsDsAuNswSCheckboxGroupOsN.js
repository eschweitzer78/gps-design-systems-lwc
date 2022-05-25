/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmnistudioCheckboxGroup from "omnistudio/checkboxGroup";
import tmpl from "./sfGpsDsAuNswSCheckboxGroupOsN.html";

export default class SfGpsDsAuNswNCheckboxGroupOsN extends OmnistudioCheckboxGroup {
  render() {
    return tmpl;
  }

  get computedAriaInvalid() {
    return this.isError;
  }

  get computedAriaDescribedBy() {
    if (this.fieldLevelHelp) {
      return this.isError === "invalid" ? "errorMessageBlock helper" : "helper";
    }

    return this.isError === "invalid" ? "errorMessageBlock" : "";
  }

  get computedLegendClassName() {
    return this.required ? "form-required" : "";
  }

  get computedInputClassName() {
    return this.isError ? "error" : "";
  }

  get isRealError() {
    return this.isError && this.errorMessage;
  }
}
