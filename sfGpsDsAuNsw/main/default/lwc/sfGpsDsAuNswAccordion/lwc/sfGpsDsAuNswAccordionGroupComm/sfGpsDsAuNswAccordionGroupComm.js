/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";

const CONTENT_DEFAULT = [];

export default class extends SfGpsDsLwc {
  @api showButtons;
  @api className;

  /* api: content */

  _content = CONTENT_DEFAULT;
  _contentOriginal;
  _numberOpen = 0;

  @api
  get content() {
    return this._contentOriginal;
  }

  set content(markdown) {
    try {
      this._contentOriginal = markdown;
      this._content = mdEngine
        .extractH1s(markdown.replaceAll("\\n", "\n"))
        .map((h1) => ({ ...h1, closed: true }));
    } catch (e) {
      this.addError("CO-MD", "Issue when parsing Content markdown");
    }
  }

  /* computed */

  get computedIsFullyExpanded() {
    return this._numberOpen === this._content.length;
  }

  get computedIsFullyCollapsed() {
    return this._numberOpen === 0;
  }

  /* event management */

  handleExpand(event) {
    this._content[event.target.index].closed = false;
    this._numberOpen++;
  }

  handleCollapse(event) {
    this._content[event.target.index].closed = true;
    this._numberOpen--;
  }

  handleExpandAll() {
    this._numberOpen = this._content.length;
    this._content.forEach((h1) => (h1.closed = false));
  }

  handleCollapseAll() {
    this._numberOpen = 0;
    this._content.forEach((h1) => (h1.closed = true));
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("nsw-scope");
  }
}
