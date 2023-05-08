/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api, track } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuNswCalloutComm extends SfGpsDsLwc {
  @api title;
  @api className;

  @track _level = 4;
  _originalLevel = "4";

  @api get level() {
    return this._originalLevel;
  }

  set level(level) {
    this._originalLevel = level;
    let iLevel = parseInt(level.toString(), 10);

    if (isNaN(iLevel) || iLevel < 1 || iLevel > 6) {
      this.addError("LV-VA", "Level should be an integer value from 1 to 6");
    }

    this._level = iLevel;
  }

  _content;
  _contentHtml;

  @api get content() {
    return this._content;
  }

  set content(markdown) {
    this._content = markdown;
    try {
      this._contentHtml = mdEngine.renderEscaped(markdown);
    } catch (e) {
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
       * but here our containment hierarchy is a bit different.
       */

      let span = this.title ? `<span></span>` : "";
      let markup = (this.title ? span : "") + this._contentHtml;

      replaceInnerHtml(element, markup);
    }
  }
}
