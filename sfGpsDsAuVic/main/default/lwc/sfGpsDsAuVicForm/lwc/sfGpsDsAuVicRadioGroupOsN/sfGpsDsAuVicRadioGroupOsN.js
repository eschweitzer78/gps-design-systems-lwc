/*
 * Copyright (c) 2022-2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmnistudioRadioGroup from "c/sfGpsDsOmniRadioGroupOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuVicRadioGroupOsN.html";

export default class extends OmnistudioRadioGroup {
  /* computed */

  get computedAriaInvalid() {
    return this.sfGpsDsIsError;
  }

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.sfGpsDsIsError
    });
  }

  get computedFormGroupClassName() {
    return {
      "form-group": true,
      valid: !this.sfGpsDsIsError,
      invalid: this.sfGpsDsIsError,
      required: this.required
    };
  }

  get sfGpsDsInternalOpts() {
    return this.internalOpts.map((item) => ({
      ...item,
      className: item.selected ? "is-checked" : null
    }));
  }

  /* lifecycle */

  render() {
    return tmpl;
  }

  renderedCallback() {
    // Fixing issue #19
  }
}
