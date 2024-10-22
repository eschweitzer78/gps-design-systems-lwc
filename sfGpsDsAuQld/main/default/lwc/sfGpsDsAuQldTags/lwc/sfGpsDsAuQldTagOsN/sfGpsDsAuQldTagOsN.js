/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";
import { computeClass, normaliseString } from "c/sfGpsDsHelpersOs";

const TAG_SIZE_DEFAULT = "default";
const TAG_SIZE_LARGE = "large";
const TAG_SIZES = [TAG_SIZE_DEFAULT, TAG_SIZE_LARGE];

export default class extends LightningElement {
  @api url;
  @api text;
  @api className;

  /* api: size */

  _sizeOriginal;
  _size = false;

  @api
  get size() {
    return this._sizeOriginal;
  }

  set size(value) {
    this._sizeOriginal = value;
    this._size = normaliseString(value, {
      validValues: TAG_SIZES,
      fallbackValue: TAG_SIZES[0]
    });
  }

  /* getters */

  get computedClassName() {
    return computeClass({
      qld__tag: true,
      "qld__tag--info": !this.url,
      "qld__tag--large": this._size === TAG_SIZE_LARGE,
      [this.className]: this.tagClassName
    });
  }
}
