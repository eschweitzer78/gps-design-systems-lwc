/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwcOsN";
import mdEngine from "c/sfGpsDsMarkdownOs";
import { replaceInnerHtml, computeClass } from "c/sfGpsDsHelpersOs";

export default class SfGpsDsAuNswSAlertOsN extends SfGpsDsLwc {
  @api title;
  @api className = "";
  @api as = "info";
  @api compact = false;

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
        this._contentHtml = mdEngine.renderEscaped(this._contentOriginal);
      }
    } catch (e) {
      console.log(e);
      this.addError("CO-MD", "Issue when parsing Content markdown");
    }
  }

  get computedClassName() {
    return computeClass({
      alert: true,
      "alert-compact": this.compact,
      "alert-info": this.as === "info",
      "alert-warning": this.as === "warning",
      "alert-error": this.as === "error",
      "alert-success": this.as === "success",
      [this.className]: this.className
    });
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("nsw-s-scope");
  }

  renderedCallback() {
    if (this._contentOriginal) {
      /*
       * We have to add an empty span if there is a title to trigger the appropriate css for *+p and similar
       * as the react component would have one for the title in the same scope,
       * but here we have the title markup in a different css scope
       */

      replaceInnerHtml(
        this.refs.markdown,
        (this.title && !this.compact ? `<span></span>` : "") + this._contentHtml
      );
    }
  }
}
