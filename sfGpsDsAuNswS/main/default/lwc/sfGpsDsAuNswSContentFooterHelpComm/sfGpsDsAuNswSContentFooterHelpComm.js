/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuNswSContentFooterHelpComm";

export default class extends SfGpsDsLwc {
  @api title;

  /* api: text */

  _textOriginal;
  _textHtml;

  @api
  get text() {
    return this._textOriginal;
  }

  set text(markdown) {
    try {
      this._textOriginal = markdown;
      this._textHtml = markdown ? mdEngine.render(markdown) : "";
    } catch (e) {
      this.addError("IN-MD", "Issue when parsing Text markdown");
      if (DEBUG) console.debug(CLASS_NAME, "set text", e);
    }
  }

  renderedCallback() {
    if (this._textOriginal) {
      replaceInnerHtml(this.refs.markdown, this._textHtml);
    }
  }
}
