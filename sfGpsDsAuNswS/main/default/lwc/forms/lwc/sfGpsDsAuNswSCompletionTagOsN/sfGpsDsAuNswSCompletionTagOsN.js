/*
 * Copyright (c) 202-2024, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";
import { normaliseBoolean } from "c/sfGpsDsHelpersOs";

const COMPLETE_DEFAULT = false;

export default class extends LightningElement {
  @api className;

  /* api: complete */

  _complete = COMPLETE_DEFAULT;
  _completeOriginal = COMPLETE_DEFAULT;

  @api
  get complete() {
    return this._completeOriginal;
  }

  set complete(value) {
    this._completeOriginal = value;
    this._complete = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: COMPLETE_DEFAULT
    });
  }

  /* computed */

  get computedClassName() {
    return {
      "snsw-completion-tag": true,
      "snsw-completion-tag__complete": this._complete,
      "snsw-completion-tag__incomplete": !this._complete,
      [this.className]: this.className
    };
  }
}
