/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";
import { normaliseBoolean } from "c/sfGpsDsHelpers";

const FIRSTCHILD_DEFAULT = false;

export default class extends LightningElement {
  static renderMode = "light";

  @api title;
  @api links;
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
      "nsw-link-list": true,
      [this.className]: this.className
    };
  }
}
