/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";
import { computeClass, normaliseString } from "c/sfGpsDsHelpersOs";

const TAG_SIZE_DEFAULT = "default";
const TAG_SIZE_VALUES = {
  default: "",
  large: "qld__tag--large"
};

export default class extends LightningElement {
  @api url;
  @api text;
  @api className;

  /* api: size */

  _sizeOriginal = TAG_SIZE_VALUES[TAG_SIZE_DEFAULT];
  _size = TAG_SIZE_DEFAULT;

  @api
  get size() {
    return this._sizeOriginal;
  }

  set size(value) {
    this._sizeOriginal = value;
    this._size = normaliseString(value, {
      validValues: TAG_SIZE_VALUES,
      fallbackValue: TAG_SIZE_DEFAULT,
      returnObjectValue: true
    });
  }

  /* getters */

  get computedClassName() {
    return computeClass({
      qld__tag: true,
      "qld__tag--info": !this.url,
      [this._size]: this._size,
      [this.className]: this.tagClassName
    });
  }
}
