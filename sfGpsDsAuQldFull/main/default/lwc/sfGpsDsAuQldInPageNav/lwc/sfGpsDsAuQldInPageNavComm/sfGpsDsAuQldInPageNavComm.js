/*
 * Copyright (c) 2024, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuQldInPageNavComm";

export default class extends SfGpsDsLwc {
  @api title;
  @api className;

  /* api: items */

  _itemsArray = [];
  _itemsOriginal;

  @api set items(markdown) {
    try {
      this._itemsOriginal = markdown;
      this._itemsArray = mdEngine.extractLinks(markdown);
    } catch (e) {
      this.addError("IT-MD", "Issue when parsing Items markdown");
      if (DEBUG) console.debug(CLASS_NAME, "set items", e);
    }
  }

  get items() {
    return this._itemsOriginal;
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("qld-scope");
  }
}
