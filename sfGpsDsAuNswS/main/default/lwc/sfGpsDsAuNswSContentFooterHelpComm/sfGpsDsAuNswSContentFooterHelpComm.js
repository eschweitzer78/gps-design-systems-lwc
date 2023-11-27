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

export default class SfGpsDsAuNswSContentFooterHelpComm extends SfGpsDsLwc {
  @api title;

  _text;
  _textHtml;

  @api get text() {
    return this._text;
  }

  set text(markdown) {
    this._text = markdown;

    try {
      this._textHtml = markdown ? mdEngine.render(markdown) : "";
    } catch (e) {
      this.addError("IN-MD", "Issue when parsing Text markdown");
    }
  }

  renderedCallback() {
    if (this._text) {
      replaceInnerHtml(this.refs.markdown, this._textHtml);
    }
  }
}
