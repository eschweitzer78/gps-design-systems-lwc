/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";

export default class SfGpsDsUkGovWarningTextComm extends SfGpsDsLwc {
  @api as = "warning";
  @api className = "";

  _contentOriginal;
  _contentHtml;

  @api set content(markdown) {
    this._contentOriginal = markdown;
    this.generateContentHtml();
  }

  get content() {
    return this._contentOriginal;
  }

  generateContentHtml() {
    try {
      if (this._contentOriginal) {
        this._contentHtml = this._compact
          ? mdEngine.renderEscapedUnpackFirstP(this._contentOriginal)
          : mdEngine.renderEscaped(this._contentOriginal);
      }
    } catch (e) {
      console.log(e);
      this.addError("CO-MD", "Issue when parsing Content markdown");
    }
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("govuk-scope");
  }

  renderedCallback() {
    if (this._contentOriginal) {
      replaceInnerHtml(this.refs.markdown, this._contentHtml);
    }
  }
}
