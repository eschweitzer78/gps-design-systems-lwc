/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";

const ITEMS_DEFAULT = [];

export default class extends SfGpsDsLwc {
  @api label = "Breadcrumb";
  @api linkComponent = "a";
  @api className = "";

  /* api: items */

  _items = ITEMS_DEFAULT;
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
      this._items = ITEMS_DEFAULT;
    }
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("nsw-scope");
  }
}
