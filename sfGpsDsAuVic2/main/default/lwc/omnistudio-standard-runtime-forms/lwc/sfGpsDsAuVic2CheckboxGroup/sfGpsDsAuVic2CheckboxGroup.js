/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmnistudioCheckboxGroup from "c/sfGpsDsOmniCheckboxGroup";
import {
  computeClass,
  normaliseString,
  normaliseBoolean
} from "c/sfGpsDsHelpers";
import { api } from "lwc";
import tmpl from "./sfGpsDsAuVic2CheckboxGroup.html";

const VARIANT_DEFAULT = "default";
const VARIANT_VALUES = {
  default: "rpl-form-option--default",
  reverse: "rpl-form-option--reverse"
};

const READONLY_DEFAULT = false;

const DEBUG = false;
const CLASS_NAME = "sfGpsDsVic2CheckboxGroup";

export default class extends OmnistudioCheckboxGroup {
  /* api: variant */

  _variant = VARIANT_VALUES[VARIANT_DEFAULT];
  _variantOriginal = VARIANT_DEFAULT;

  @api
  get variant() {
    return this._variantOriginal;
  }

  set variant(value) {
    if (DEBUG) console.debug(CLASS_NAME, "> set variant", value);

    this._variantOriginal = value;
    this._variant = normaliseString(value, {
      validValues: VARIANT_VALUES,
      fallbackValue: VARIANT_DEFAULT,
      returnObjectValue: true
    });

    if (DEBUG) console.debug(CLASS_NAME, "< set variant", this._variant);
  }

  /* api: readOnly */

  _readOnly = READONLY_DEFAULT;
  _readOnlyOriginal = READONLY_DEFAULT;

  @api
  get readOnly() {
    return this._readOnlyOriginal;
  }

  set readOnly(value) {
    if (DEBUG) console.debug(CLASS_NAME, "> set readOnly", value);

    this._readOnlyOriginal = value;
    this._readOnly = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: READONLY_DEFAULT
    });

    if (DEBUG) console.debug(CLASS_NAME, "< set readOnly", this._readOnly);
  }

  /* computed */

  get computedGroupClassName() {
    if (DEBUG) console.debug(CLASS_NAME, "> computedGroupClassName");

    const rv = {
      "rpl-form-option-group": true,
      "rpl-form-option-group--block": this.alignment === "vertical",
      "rpl-form-option-group--inline": this.alignment === "horizontal"
    };

    if (DEBUG)
      console.debug(CLASS_NAME, "< computedGroupClassName", JSON.stringify(rv));
    return rv;
  }

  get computedOptionClassName() {
    if (DEBUG) console.debug(CLASS_NAME, "> computedOptionClassName");

    const rv = {
      "rpl-form-option": true,
      [this._variant]: this._variant
    };

    if (DEBUG)
      console.debug(
        CLASS_NAME,
        "< computedOptionClassName",
        JSON.stringify(rv)
      );
    return rv;
  }

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this.fieldLevelHelp,
      errorMessageBlock: this.fieldLevelHelp && this.sfGpsDsIsError
    });
  }

  /* lifecycle */

  render() {
    return tmpl;
  }

  renderedCallback() {
    /* parent makes assumption about markup and expects slds-form-element__control */
    /* workaround is not to execute that logic */
  }
}
