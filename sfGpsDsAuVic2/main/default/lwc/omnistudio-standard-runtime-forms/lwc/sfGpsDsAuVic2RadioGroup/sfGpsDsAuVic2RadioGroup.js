/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmnistudioRadioGroup from "c/sfGpsDsOmniRadioGroup";
import {
  computeClass,
  normaliseString,
  normaliseBoolean
} from "c/sfGpsDsHelpers";
import { api } from "lwc";
import tmplRadio from "./sfGpsDsAuVic2RadioGroup.html";
import tmplButton from "./sfGpsDsAuVic2RadioGroup-buttons.html";

const VARIANT_DEFAULT = "default";
const VARIANT_VALUES = {
  default: "rpl-form-option--default",
  reverse: "rpl-form-option--reverse"
};

const PERFECTSQUAREBUTTONS_DEFAULT = false;

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

  /* api: perfectSquares */

  _perfectSquareButtons = PERFECTSQUAREBUTTONS_DEFAULT;
  _perfectSquareButtonsOriginal = PERFECTSQUAREBUTTONS_DEFAULT;

  @api
  get perfectSquareButtons() {
    return this._perfectSquareButtonsOriginal;
  }

  set perfectSquareButtons(value) {
    this._perfectSquareButtonsOriginal = value;
    this._perfectSquareButtons = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: PERFECTSQUAREBUTTONS_DEFAULT
    });
  }

  /* computed */

  get computedButtonsClassName() {
    return {
      "rpl-form-opt-buttons": true,
      "rpl-form-opt-buttons--squares": this._perfectSquareButtons
    };
  }

  get computedGroupClassName() {
    const rv = {
      "rpl-form-option-group": true,
      "rpl-form-option-group--block": this.alignment === "vertical",
      "rpl-form-option-group--inline": this.alignment === "horizontal"
    };

    return rv;
  }

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
    return this.isbutton ? tmplButton : tmplRadio;
  }

  renderedCallback() {
    // Fixing issue #19
  }
}
