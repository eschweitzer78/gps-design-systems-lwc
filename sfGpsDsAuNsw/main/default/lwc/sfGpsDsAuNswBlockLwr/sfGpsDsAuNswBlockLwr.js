/*
 * Copyright (c) 2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { normaliseBoolean } from "c/sfGpsDsHelpers";

const FIRSTCHILD_DEFAULT = false;

/**
 * @slot Block
 */
export default class extends SfGpsDsLwc {
  static renderMode = "light";

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

  /* computed */

  get computedClassName() {
    return {
      "nsw-block": true,
      [this.className]: this.className
    };
  }

  /* lifecycle */

  connectedCallback() {
    this._isLwrOnly = true;
    super.connectedCallback();
    this.classList.add("nsw-scope");
  }
}
