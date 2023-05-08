/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api, track } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

const SHORTEN_CUTOFF = 4;
const SHORTEN_PRE = 2;
const SHORTEN_POST = 2;

export default class SfGpsDsAuQldBreadcrumbs extends LightningElement {
  static renderMode = "light";

  @api label = "breadcrumbs";
  @api className;
  @api items = [];

  @track _shorten = true;

  get _decoratedItems() {
    let base = this.items;

    if (this.items && this.items.length > SHORTEN_CUTOFF) {
      base = [];
      for (let i = 0, length = this.items.length; i < length; i++) {
        if (i < SHORTEN_PRE) {
          base.push(this.items[i]);
        }
        if (i === SHORTEN_PRE) {
          base.push({ text: "[...]", shorten: true });
        }
        if (i >= SHORTEN_PRE && i < length - SHORTEN_POST) {
          base.push({ ...this.items[i], shortened: this._shorten });
        }
        if (i >= length - SHORTEN_POST) {
          base.push(this.items[i]);
        }
      }
    }

    return base.map((item, index) => ({
      ...item,
      key: `item-${index + 1}`
    }));
  }

  get computedClassName() {
    return computeClass({
      "qg-global-breaddrumb": true,
      "qg-breadcrumb": true,
      [this.className]: this.className
    });
  }

  get computedListClassName() {
    return computeClass({
      "qg-breadcrumb-list": true,
      expanded: !this._shorten
    });
  }

  handleExpand(event) {
    event.preventDefault();
    event.stopPropagation();

    this._shorten = false;
  }
}
