/*
 * Copyright (c) 2024, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwcOsN";
import mdEngine from "c/sfGpsDsMarkdownOs";
import {
  replaceInnerHtml,
  normaliseString,
  normaliseBoolean
} from "c/sfGpsDsHelpersOs";

const AS_DEFAULT = "info";
const AS_VALUES = {
  info: "alert-info",
  warning: "alert-warning",
  error: "alert-error",
  success: "alert-success"
};

const COMPACT_DEFAULT = false;

export default class extends SfGpsDsLwc {
  @api title;
  @api className;

  /* api: as */

  _as = AS_VALUES[AS_DEFAULT];
  _asOriginal = AS_DEFAULT;

  @api
  get as() {
    return this._asOriginal;
  }

  set as(value) {
    this._asOriginal = value;
    this._as = normaliseString(value, {
      validValues: AS_VALUES,
      defaultValue: AS_DEFAULT,
      returnObjectValue: true
    });
  }

  /* api: compact */

  _compact = COMPACT_DEFAULT;
  _compactOriginal = COMPACT_DEFAULT;

  @api
  get compact() {
    return this._compactOriginal;
  }

  set compact(value) {
    this._compactOriginal = value;
    this._compact = normaliseBoolean(value, {
      acceptString: true,
      defaultValue: COMPACT_DEFAULT
    });
  }

  /* api: content */

  _contentHtml;
  _contentOriginal;

  @api
  get content() {
    return this._contentOriginal;
  }

  set content(markdown) {
    try {
      this._contentOriginal = markdown;
      this._contentHtml = markdown ? mdEngine.renderEscaped(markdown) : null;
    } catch (e) {
      console.log(e);
      this.addError("CO-MD", "Issue when parsing Content markdown");
    }
  }

  get computedClassName() {
    return {
      alert: true,
      "alert-compact": this._compact,
      [this._as]: this._as,
      [this.className]: this.className
    };
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
        (this.title && !this._compact ? `<span></span>` : "") +
          this._contentHtml
      );
    }
  }
}
