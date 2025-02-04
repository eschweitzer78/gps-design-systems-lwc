/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import { parseIso8601, replaceInnerHtml } from "c/sfGpsDsHelpers";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";

export default class extends SfGpsDsLwc {
  @api cstyle = "white"; // PropTypes.oneOf(['dark', 'light', 'white']),
  @api orientation = "vertical"; // oneOf 'vertical' 'horizontal'
  @api dateStyle = "medium"; // oneOf short medium long full
  @api tag;
  @api image;
  @api imageAlt;
  @api className;

  // This is not exposed in Experience Builder and is used by cardCollectionComm
  @api useMarkup = false;

  /* api: headline and link */

  _headline; // combined link into headline
  _headlineOriginal;

  @api
  get headline() {
    return this._headlineOriginal;
  }

  set headline(markdown) {
    try {
      this._headlineOriginal = markdown;
      this._headline = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError("HL-MD", "Issue when parsing Headline markdown");
    }
  }

  get _headlineText() {
    return this._headline?.text;
  }

  get _headlineUrl() {
    return this._headline?.url;
  }

  /* api: date */

  _date;
  _dateOriginal;

  @api
  get date() {
    return this._dateOriginal;
  }

  set date(value) {
    this._dateOriginal = value;

    if (value instanceof Date) {
      this._date = value;
    } else {
      this._date = value ? parseIso8601(value.toString()) : null;
    }
  }

  /* api: copy */

  _copyHtml;
  _copyOriginal;

  @api
  get copy() {
    return this._copyOriginal;
  }

  set copy(markdown) {
    try {
      this._copyOriginal = markdown;
      if (markdown) {
        this._copyHtml = this.useMarkup
          ? markdown
          : mdEngine.renderEscaped(markdown);
      } else {
        this._copyHtml = null;
      }
    } catch (e) {
      this.addError("CO-MD", "Issue when parsing Copy markdown");
    }
  }

  /* api: footer */

  _footerHtml;
  _footerOriginal;

  @api
  get footer() {
    return this._footerOriginal;
  }

  set footer(markdown) {
    try {
      this._footerOriginal = markdown;
      if (markdown) {
        this._footerHtml = this.useMarkup
          ? markdown
          : mdEngine.renderEscaped(markdown);
      } else {
        this._footerHtml = null;
      }
    } catch (e) {
      this.addError("FO-MD", "Issue when parsing Footer markdown");
    }
  }

  /* computed */

  get highlight() {
    return this.cstyle === "highlight";
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("nsw-scope");
  }

  renderedCallback() {
    if (this._copyOriginal) {
      replaceInnerHtml(this.refs.copy, this._copyHtml);
    }

    if (this._footerOriginal) {
      replaceInnerHtml(this.refs.footer, this._footerHtml);
    }
  }
}
