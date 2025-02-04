/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { LightningElement, api } from "lwc";
import {
  normaliseString,
  normaliseBoolean,
  computeClass
} from "c/sfGpsDsHelpers";

const THEME_DEFAULT = "default";
const THEME_VALUES = {
  default: "",
  primary: "rpl-button--primary",
  secondary: "rpl-button--secondary"
};

const DISABLED_DEFAULT = false;

export default class extends LightningElement {
  static renderMode = "light";

  @api href;
  @api target;

  /* api: theme */

  _theme = THEME_VALUES[THEME_DEFAULT];
  _themeOriginal = THEME_DEFAULT;

  @api
  get theme() {
    return this._themeOriginal;
  }

  set theme(value) {
    this._themeOriginal = value;
    this._theme = normaliseString(value, {
      validValues: THEME_VALUES,
      fallbackValue: THEME_DEFAULT,
      returnObjectValue: true
    });
  }

  /* api: disabled */

  _disabled = DISABLED_DEFAULT;
  _disabledOriginal = DISABLED_DEFAULT;

  @api
  get disabled() {
    return this._disabledOriginal;
  }

  set disabled(value) {
    this._disabledOriginal = value;
    this._disabled = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: DISABLED_DEFAULT
    });
  }

  /* computed */

  get computedButtonClassName() {
    /* cannot remove computeClass due to use with vic-link */

    return computeClass({
      "rpl-button": true,
      [this._theme]: this._theme,
      "rpl-button--disabled": this._disabled
    });
  }
}
