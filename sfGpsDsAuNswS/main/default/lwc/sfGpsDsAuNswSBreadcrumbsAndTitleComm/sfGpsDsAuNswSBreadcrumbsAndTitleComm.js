/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api, track } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuNswSBreadcrumbsAndTitleComm extends SfGpsDsLwc {
  @api label = "Breadcrumbs";
  @api title;
  @api legend;
  @api className;

  _items;
  @track _itemsArray = [];

  @api set items(markdown) {
    this._items = markdown;
    try {
      let arr = mdEngine.extractLinks(markdown);
      let lengthm1 = arr.length - 1;

      this._itemsArray = arr.map((item, index) => {
        let className = "";

        if (arr.length === 1 && item.url) {
          className = "breadcrumb__back";
        } else if (index === lengthm1 && item.url) {
          className = "breadcrumb__previous";
        } else if (index === lengthm1 - 1 && item.url && !arr[lengthm1].url) {
          className = "breadcrumb__previous";
        }

        return {
          ...item,
          className: className
        };
      });
    } catch (e) {
      this.addError("IT-MD", "Issue when parsing Items markdown");
    }
  }

  get items() {
    return this._items;
  }

  get computedClassName() {
    return computeClass({
      "page-header": true,
      "servicensw-embed": true,
      "page-header--top": !this.title,
      [this.className]: this.className
    });
  }
}
