/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";

const CONTENT_DEFAULT = [];

export default class extends SfGpsDsLwc {
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
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      this.addError("CO-MD", "Issue when parsing Content markdown");
      this._content = CONTENT_DEFAULT;
    }
  }
}
