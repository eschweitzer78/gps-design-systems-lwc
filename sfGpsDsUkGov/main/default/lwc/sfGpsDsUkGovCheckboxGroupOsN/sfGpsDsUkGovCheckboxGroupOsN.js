/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import OmnistudioCheckboxGroup from "omnistudio/checkboxGroup";
import tmpl from "./sfGpsDsUkGovCheckboxGroupOsN.html";

export default class SfGpsDsUkGovCheckboxGroupOsN extends OmnistudioCheckboxGroup {
  render() {
    return tmpl;
  }

  get computedAriaInvalid() {
    return this.isError;
  }

  get computedAriaDescribedBy() {
    if (this.fieldLevelHelp) {
      return this.isError ? "errorMessageBlock helper" : "helper";
    }

    return this.isError ? "errorMessageBlock" : null;
  }

  get isRealError() {
    return this.isError && this.errorMessage;
  }
}
