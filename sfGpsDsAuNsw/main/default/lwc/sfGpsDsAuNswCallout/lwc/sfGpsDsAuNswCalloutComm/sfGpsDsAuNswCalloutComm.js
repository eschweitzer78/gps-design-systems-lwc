/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { replaceInnerHtml, toNumber } from "c/sfGpsDsHelpers";

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuNswCalloutComm";

export default class extends SfGpsDsLwc {
  @api title;
  @api firstChild;
  @api className;

  /* api: level */

  _level = 4;
  _levelOriginal = "4";

  @api
  get level() {
    return this._levelOriginal;
  }

  set level(level) {
    this._levelOriginal = level;
    const nLevel = toNumber(level);

    if (Number.isNaN(nLevel) || nLevel < 1 || nLevel > 6) {
      this.addError("LV-VA", "Level should be a value from 1 to 6");
    } else {
      this._level = Math.round(nLevel);
    }
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
      this._contentHtml = mdEngine.renderEscaped(markdown);
    } catch (e) {
      this.addError("CO-MD", "Issue when parsing Content markdown");
      if (DEBUG) console.debug(CLASS_NAME, "set content", e);
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
     * but here our containment hierarchy is a bit different.
     */

    const markup = (this.title ? "<span></span>" : "") + this._contentHtml;
    replaceInnerHtml(this.refs.markdown, markup);
  }
}
