/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";
import { normaliseInteger, normaliseBoolean } from "c/sfGpsDsHelpers";

const LEVEL_MIN = 1;
const LEVEL_MAX = 6;
const LEVEL_DEFAULT = 4;

const FIRSTCHILD_DEFAULT = false;

export default class extends LightningElement {
  static renderMode = "light";

  @api title;
  @api className;

  /* api: firstChild */

  _firstChild = FIRSTCHILD_DEFAULT;
  _firstChildOriginal = FIRSTCHILD_DEFAULT;

  @api
  get firstChild() {
    return this._firstChildOriginal;
  }

  set firstChild(value) {
    this._firstChildOriginal = value;
    this._firstChild = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: FIRSTCHILD_DEFAULT
    });
  }

  /* api: level */

  _level = LEVEL_DEFAULT;
  _levelOriginal = LEVEL_DEFAULT;

  @api
  get level() {
    return this._levelOriginal;
  }

  set level(value) {
    this._levelOriginal = value;
    this._level = normaliseInteger(value, {
      acceptString: true,
      min: LEVEL_MIN,
      max: LEVEL_MAX,
      fallbackValue: LEVEL_DEFAULT
    });
  }

  /* computed */

  get computedClassName() {
    return {
      "nsw-callout": true,
      [this.className]: this.className
    };
  }

  get computedTitleClassName() {
    return `nsw-h${this._level}`;
  }
}
