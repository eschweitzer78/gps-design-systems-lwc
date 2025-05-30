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
  @api title;
  @api type;
  @api showButtons;
  @api className;

  /* content */

  _content = CONTENT_DEFAULT;
  _contentOriginal;

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
      this._content = CONTENT_DEFAULT;
    }
  }
}
