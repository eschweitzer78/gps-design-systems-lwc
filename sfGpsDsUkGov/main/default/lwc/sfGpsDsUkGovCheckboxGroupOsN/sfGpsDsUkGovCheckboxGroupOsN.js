/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmniscriptCheckboxGroup from "omnistudio/checkboxGroup";
import SfGpsDsUkGovLabelMixin from "c/sfGpsDsUkGovLabelMixinOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsUkGovCheckboxGroupOsN.html";

export default class SfGpsDsUkGovCheckboxGroupOsN extends SfGpsDsUkGovLabelMixin(
  OmniscriptCheckboxGroup,
  "large"
) {
  render() {
    return tmpl;
  }

  get computedAriaInvalid() {
    return this.isError;
  }

  get computedAriaDescribedBy() {
    let isRealError = this.isRealError;

    return computeClass({
      errorMessageBlock: isRealError,
      helper: isRealError && this.fieldLevelHelp
    });
  }

  get isRealError() {
    return this.isError && this._errorMessage;
  }

  get _errorMessage() {
    return this.errorMessage?.replace("Error: ", "");
  }
}
