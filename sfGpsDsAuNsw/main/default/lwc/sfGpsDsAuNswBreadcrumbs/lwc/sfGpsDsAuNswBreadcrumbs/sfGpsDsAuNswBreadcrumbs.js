/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api, track } from "lwc";
import { isArray } from "c/sfGpsDsHelpers";

export default class extends LightningElement {
  static renderMode = "light";

  @api label = "breadcrumbs";
  @api items = [];
  @api containerClassName = "nsw-p-bottom-xs nsw-m-bottom-sm";
  @api className = "";

  @track _showMore = false;
  _moreToggle = "more-toggle";

  /* computed */

  get computedClassName() {
    return {
      "nsw-breadcrumbs": true,
      [this.className]: this.className
    };
  }

  get computedOlClassName() {
    return {
      "nsw-breadcrumbs__show-all": this._showMore
    };
  }

  get decoratedItems() {
    if (!isArray(this.items)) {
      return [];
    }

    const length = this.items.length;
    return this.items.map((item, index) => ({
      ...item,
      isSecond: index === 1 && length > 3
    }));
  }

  /* event management */

  handleMoreToggle() {
    this._showMore = true;
  }
}
