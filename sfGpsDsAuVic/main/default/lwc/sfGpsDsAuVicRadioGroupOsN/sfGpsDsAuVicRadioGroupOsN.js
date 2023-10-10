/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmnistudioRadioGroup from "omnistudio/radioGroup";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuVicRadioGroupOsN.html";

export default class SfGpsDsAuVicRadioGroupOsN extends OmnistudioRadioGroup {
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
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.isError
    });
  }

  get computedFormGroupClassName() {
    return computeClass({
      "form-group": true,
      valid: !this.isError,
      invalid: this.isError,
      required: this.required
    });
  }

  get _decoratedInternalOpts() {
    return this.internalOpts.map((item) => ({
      ...item,
      className: computeClass({
        "is-checked": item.selected
      })
    }));
  }

  get isRealError() {
    return this.isError && this.errorMessage;
  }
}
