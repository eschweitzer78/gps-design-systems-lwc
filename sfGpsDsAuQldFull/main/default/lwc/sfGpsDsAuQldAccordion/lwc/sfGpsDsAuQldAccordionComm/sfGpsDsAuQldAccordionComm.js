/*
 * Copyright (c) 2024, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api, track } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";

export default class extends SfGpsDsLwc {
  @api cstyle;
  @api className;

  /* api: content */

  _itemsOriginal;
  @track computedH1s = [];

  @api
  get items() {
    return this._itemsOriginal;
  }

  set items(markdown) {
    this._itemsOriginal = markdown;

    try {
      let h1s = mdEngine.extractH1s(markdown.replaceAll("\\n", "\n"));
      this.computedH1s = h1s.map((h1) => ({ ...h1, active: false }));
    } catch (e) {
      this.addError("CO-MD", "Issue when parsing Content markdown");
      this.computedH1s = [];
    }
  }

  /* event management */

  handleToggleItem(event) {
    const targetIndex = event.detail.index;
    this.computedH1s = this.computedH1s.map((h1, index) => ({
      ...h1,
      active: index === targetIndex ? !h1.active : h1.active
    }));
  }
}
