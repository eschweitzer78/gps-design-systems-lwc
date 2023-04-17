/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";

export default class SfGpsDsAuNswAccordionGroup extends SfGpsDsLwc {
  static renderMode = "light";

  @api showButtons;
  @api className;

  _content;
  _h1s = [];
  _numberOpen = 0;

  @api get content() {
    return this._content;
  }

  set content(markdown) {
    this._content = markdown;

    try {
      let h1s = mdEngine.extractH1s(markdown.replaceAll("\\n", "\n"));
      this._h1s = h1s.map((h1) => ({ ...h1, closed: true }));
    } catch (e) {
      this.addError("CO-MD", "Issue when parsing Content markdown");
    }
  }

  handleExpand(event) {
    this._h1s[event.target.index].closed = false;
    this._numberOpen++;
    this.dispatchEvent(
      new CustomEvent("expand", { detail: event.target.index })
    );
  }

  handleCollapse(event) {
    this._h1s[event.target.index].closed = true;
    this._numberOpen--;
    this.dispatchEvent(
      new CustomEvent("collapse", { detail: event.target.index })
    );
  }

  handleExpandAll() {
    this._numberOpen = this._h1s.length;
    this._h1s.forEach((h1) => (h1.closed = false));
    this.dispatchEvent(new CustomEvent("expand", { detail: "all" }));
  }

  handleCollapseAll() {
    this._numberOpen = 0;
    this._h1s.forEach((h1) => (h1.closed = true));
    this.dispatchEvent(new CustomEvent("collapse", { detail: "all" }));
  }

  get isFullyExpanded() {
    return this._numberOpen === this._h1s.length;
  }

  get isFullyCollapsed() {
    return this._numberOpen === 0;
  }

  get computedClassName() {
    return computeClass({
      "nsw-accordion": true,
      ready: true,
      [this.className]: this.className
    });
  }
}
