/*
 * Copyright (c) 2023-2024, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api, track } from "lwc";
import { parseIso8601, replaceInnerHtml } from "c/sfGpsDsHelpers";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuNswCardV2Comm";

/**
 * @slot Card-Copy
 * @slot Card-Footer
 */
export default class extends SfGpsDsLwc {
  @api cstyle = "white"; // PropTypes.oneOf(['dark', 'light', 'white']),
  @api orientation = "vertical"; // oneOf 'vertical' 'horizontal'
  @api dateStyle = "medium"; // oneOf short medium long full
  @api headline;
  @api tag;
  @api image;
  @api imageAlt;
  @api preventDefault = false;
  @api className;

  // This is not exposed in Experience Builder and is used by cardCollectionComm
  @api useMarkup = false;

  @track copySlotted = false;
  @track footerSlotted = false;

  /* api: title and link, String */

  _title; // combined link into headline
  _titleOriginal;

  @api
  get title() {
    return this._titleOriginal;
  }

  set title(markdown) {
    try {
      this._titleOriginal = markdown;
      this._title = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError("HL-MD", "Issue when parsing Title markdown");
      if (DEBUG) console.debug(CLASS_NAME, "set title", e);
    }
  }

  get _titleText() {
    return this._title?.text;
  }

  get _titleUrl() {
    return this._title?.url;
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
      if (DEBUG) console.debug(CLASS_NAME, "set copy", e);
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
      if (DEBUG) console.debug(CLASS_NAME, "set footer", e);
    }
  }

  get highlight() {
    return this._cstyle === "highlight";
  }

  get computedCopyClassName() {
    return this.copySlotted ? "nsw-card__copy" : null;
  }

  get computedFooterClassName() {
    return this.copySlotted ? "nsw-card__footer" : null;
  }

  /* methods */

  @api click() {
    if (this.refs.card) this.refs.card.click();
  }

  /* event management */

  handleSlotChange(event) {
    const an = event.target.assignedNodes();
    let emptyNode = true;

    /* 
      Try and determine if it's an empty design node...
      very imperfect as further edits won't be detected, but at least it's good on reload 
    */

    if (an.length) {
      if (an[0].tagName?.startsWith("WEBRUNTIMEDESIGN")) {
        if (an[0].querySelector(".actualNode")) {
          emptyNode = false;
        }
      } else {
        emptyNode = false;
      }
    }

    switch (event.target.name) {
      case "Card-Copy":
        this.copySlotted = !emptyNode;
        break;

      case "Card-Footer":
        this.footerSlotted = !emptyNode;
        break;

      default:
    }
  }

  handleNavigate(event) {
    this.dispatchEvent(new CustomEvent("navigate", { detail: event.detail }));
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
