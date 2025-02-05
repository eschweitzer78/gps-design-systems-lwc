/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";

export default class extends SfGpsDsLwc {
  @api title;
  @api firstChild = false;
  @api className;

  /* api: items */

  _items = [];
  _itemsOriginal;

  @api
  get items() {
    return this._itemsOriginal;
  }

  set items(markdown) {
    try {
      this._itemsOriginal = markdown;
      this._items = mdEngine.extractLinks(markdown);
    } catch (e) {
      this.addError("IT-MD", "Issue when parsing Items markdown");
    }
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("nsw-scope");
  }
}
