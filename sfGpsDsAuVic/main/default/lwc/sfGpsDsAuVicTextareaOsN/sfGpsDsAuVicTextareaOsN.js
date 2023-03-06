/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import OmnistudioTextarea from "omnistudio/textarea";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuVicTextareaOsN.html";

export default class SfGpsDsAuVicTextareaOsN extends OmnistudioTextarea {
  render() {
    return tmpl;
  }

  get computedFormGroupClassName() {
    return computeClass({
      "form-group": true,
      invalid: !this.validity?.valid,
      valid: this.validity?.valid,
      required: this.required
    });
  }

  get isRealError() {
    return this.isError && this.errorMessage;
  }

  get ariaDescribedBy() {
    return computeClass({
      hint: this.fieldLevelHelp,
      errorMessageBlock: this.isRealError
    });
  }
}
