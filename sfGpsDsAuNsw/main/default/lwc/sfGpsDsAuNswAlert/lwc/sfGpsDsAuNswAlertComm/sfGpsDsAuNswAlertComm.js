/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { replaceInnerHtml, normaliseBoolean } from "c/sfGpsDsHelpers";

const COMPACT_DEFAULT = false;

export default class extends SfGpsDsLwc {
  @api title;
  @api as = "info";
  @api className = "";

  /* api: compact */

  _compact = COMPACT_DEFAULT;
  _compactOriginal = COMPACT_DEFAULT;

  @api
  get compact() {
    return this._compact;
  }

  set compact(value) {
    this._compactOriginal = value;
    this._compact = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: COMPACT_DEFAULT
    });

    this.generateContentHtml();
  }

  /* api: content */

  _contentHtml;
  _contentOriginal;

  @api set content(markdown) {
    this._contentOriginal = markdown;
    this.generateContentHtml();
  }

  get content() {
    return this._contentOriginal;
  }

  /* methods */

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
    /*
     * We have to add an empty span if there is a title to trigger the appropriate css for *+p and similar
     * as the react component would have one for the title in the same scope,
     * but here we have the title markup in a different css scope
     */

    replaceInnerHtml(
      this.refs.markdown,
      (this.title && !this._compact ? `<span></span>` : "") + this._contentHtml
    );
  }
}
