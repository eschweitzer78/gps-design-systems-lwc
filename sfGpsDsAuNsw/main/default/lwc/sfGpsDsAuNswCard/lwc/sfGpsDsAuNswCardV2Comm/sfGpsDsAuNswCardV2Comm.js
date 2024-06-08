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

/**
 * @slot Card-Copy
 * @slot Card-Footer
 */
export default class SfGpsDsAuNswCardV2Comm extends SfGpsDsLwc {
  @api cstyle = "white"; // PropTypes.oneOf(['dark', 'light', 'white']),
  @api orientation = "vertical"; // oneOf 'vertical' 'horizontal'
  @api dateStyle = "medium"; // oneOf short medium long full
  @api headline;
  @api tag;
  @api image;
  @api imageAlt;
  @api className;

  @api preventDefault = false;

  // This is not exposed in Experience Builder and is used by cardCollectionComm
  @api useMarkup = false;

  @track copySlotted = false;
  @track footerSlotted = false;

  /*
   * title and link
   */

  _title; // combined link into headline
  _originalTitle;

  @api get title() {
    return this._originalTitle;
  }

  set title(markdown) {
    this._originalTitle = markdown;

    try {
      this._title = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError("HL-MD", "Issue when parsing Title markdown");
    }
  }

  get _titleText() {
    return this._title?.text;
  }

  get _titleUrl() {
    return this._title?.url;
  }

  /*
   * date
   */

  @track _date;
  _originalDate;

  @api get date() {
    return this._originalDate;
  }

  set date(date) {
    this._originalDate = date;

    if (date instanceof Date) {
      this._date = date;
    } else {
      this._date = date ? parseIso8601(date.toString()) : null;
    }
  }

  /*
   * copy
   */

  _copy;
  _copyHtml;

  @api get copy() {
    return this._copy;
  }

  set copy(markdown) {
    this._copy = markdown;
    try {
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

  _footer;
  _footerHtml;

  @api get footer() {
    return this._footer;
  }

  set footer(markdown) {
    this._footer = markdown;
    try {
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

  get highlight() {
    return this.cstyle === "highlight";
  }

  get computedCopyClassName() {
    return this.copySlotted ? "nsw-card__copy" : null;
  }

  get computedFooterClassName() {
    return this.copySlotted ? "nsw-card__footer" : null;
  }

  get hasImage() {
    return this.image;
  }

  get hasFooter() {
    return this.footer || this.footerSlotted;
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
    if (this.copy) {
      replaceInnerHtml(this.refs.copy, this._copyHtml);
    }

    if (this.footer) {
      replaceInnerHtml(this.refs.footer, this._footerHtml);
    }
  }
}
