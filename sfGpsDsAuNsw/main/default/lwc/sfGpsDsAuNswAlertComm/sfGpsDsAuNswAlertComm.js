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

export default class SfGpsDsAuNswAlertComm extends SfGpsDsLwc {
  @api title;
  @api className = "";
  @api as = "info";

  _compact = false;

  @api set compact(value) {
    this._compact = value === true || value === "true";
    this.generateContentHtml();
  }

  get compact() {
    return this._compact;
  }

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
    this.classList.add("nsw-scope");
  }

  renderedCallback() {
    let element = this.template.querySelector(".sf-gps-ds-markdown");

    if (element) {
      /*
       * We have to add an empty span if there is a title to trigger the appropriate css for *+p and similar
       * as the react component would have one for the title in the same scope,
       * but here we have the title markup in a different css scope
       */

      replaceInnerHtml(
        element,
        (this.title && !this.compact ? `<span></span>` : "") + this._contentHtml
      );
    }
  }
}
