/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api, track } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";

export default class SfGpsDsAuNswAccordionGroupComm extends SfGpsDsLwc {
  @api title;
  @api type;
  @api showButtons;
  @api className;

  /* content */

  _originalContent;
  @track _h1s = [];

  @api get content() {
    return this._originalContent;
  }

  set content(markdown) {
    this._originalContent = markdown;

    try {
      let h1s = mdEngine.extractH1s(markdown.replaceAll("\\n", "\n"));
      this._h1s = h1s.map((h1) => ({ ...h1, closed: true }));
    } catch (e) {
      this.addError("CO-MD", "Issue when parsing Content markdown");
    }
  }
}
