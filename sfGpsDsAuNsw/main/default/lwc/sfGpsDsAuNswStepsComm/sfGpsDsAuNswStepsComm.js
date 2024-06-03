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
  @api type;
  @api cstyle;
  @api headingLevel;
  @api firstChild;
  @api className;

  /* api: content */

  _content;
  _h1s = [];

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
      this._h1s = [];
    }

    console.log("h1s", JSON.stringify(this._h1s));
  }

  /* getters */

  get hasH1s() {
    return this._h1s ? this._h1s.length > 0 : false;
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("nsw-scope");
  }
}
