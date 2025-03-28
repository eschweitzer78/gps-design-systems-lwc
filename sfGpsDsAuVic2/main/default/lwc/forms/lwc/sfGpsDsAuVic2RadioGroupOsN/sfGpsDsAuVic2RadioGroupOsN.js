/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmnistudioRadioGroup from "c/sfGpsDsOmniRadioGroupOsN";
import { computeClass, normaliseString } from "c/sfGpsDsHelpersOs";
import { api } from "lwc";
import tmpl from "./sfGpsDsAuVic2RadioGroupOsN.html";

const VARIANT_DEFAULT = "default";
const VARIANT_VALUES = {
  default: "rpl-form-option--default",
  reverse: "rpl-form-option--reverse"
};

export default class extends OmnistudioRadioGroup {
  /* api: variant */

  _variant = VARIANT_DEFAULT;
  _variantOriginal = VARIANT_VALUES[VARIANT_DEFAULT];

  @api
  get variant() {
    return this._variantOriginal;
  }

  set variant(value) {
    this._variantOriginal = value;
    this._variant = normaliseString(value, {
      validValues: VARIANT_VALUES,
      fallbackValue: VARIANT_DEFAULT,
      returnObjectValue: true
    });
  }

  /* computed */

  get computedOptionClassName() {
    return {
      "rpl-form-option": true,
      [this._variant]: this._variant
    };
  }

  get computedAriaInvalid() {
    return this.sfGpsDsIsError;
  }

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.sfGpsDsIsError
    });
  }

  /* lifecycle */

  render() {
    return tmpl;
  }

  renderedCallback() {
    // Fixing issue #19
  }
}
