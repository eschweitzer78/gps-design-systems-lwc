/*
 * Copyright (c) 2024, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";

export default class extends SfGpsDsLwc {
  @api mode;
  @api label = "Breadcrumb";
  @api className = "";

  /* api: items */

  _items;
  _itemsArray = [];

  @api set items(markdown) {
    this._items = markdown;
    try {
      this._itemsArray = mdEngine.extractLinks(markdown);
    } catch (e) {
      this.addError("IT-MD", "Issue when parsing Items markdown");
    }
  }

  get items() {
    return this._items;
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("qld-scope");
  }
}
