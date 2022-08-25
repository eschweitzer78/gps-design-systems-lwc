/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmnistudioRadioGroup from "omnistudio/radioGroup";
import tmpl from "./sfGpsDsAuNswSRadioGroupOsN.html";

export default class SfGpsDsAuNswSRadioGroupOsN extends OmnistudioRadioGroup {
  render() {
    return tmpl;
  }

  renderedCallback() {
    // Fixing issue #19
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
