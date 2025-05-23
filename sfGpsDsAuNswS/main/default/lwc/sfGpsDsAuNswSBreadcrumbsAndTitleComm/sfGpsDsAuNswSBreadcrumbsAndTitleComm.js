/*
 * Copyright (c) 2022-2024, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuNswSBreadcrumbsAndTitleComm";

export default class extends SfGpsDsLwc {
  @api label = "Breadcrumbs";
  @api title;
  @api legend;
  @api className;

  /* api: items */

  _itemsOriginal;
  _items = [];

  @api
  get items() {
    return this._itemsOriginal;
  }

  set items(markdown) {
    this._itemsOriginal = markdown;
    try {
      const arr = mdEngine.extractLinks(markdown);
      let lengthm1 = arr.length - 1;

      this._items = arr.map((item, index) => {
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
      if (DEBUG) console.debug(CLASS_NAME, "set items", e);
    }
  }

  get computedClassName() {
    return {
      "page-header": true,
      "servicensw-embed": true,
      "page-header--top": !this.title,
      [this.className]: this.className
    };
  }
}
