/*
 * Copyright (c) 2023-2024, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api, track } from "lwc";
import {
  parseIso8601,
  computeClass,
  getUserLocale,
  formatDate,
  normaliseBoolean
} from "c/sfGpsDsHelpers";

const DATE_STYLE_DEFAULT = "medium"; // one of short medium long full, defaults to medium

export default class SfGpsDsAuNswCard extends LightningElement {
  static renderMode = "light";

  @api link;
  @api cstyle = "white"; // PropTypes.oneOf(['dark', 'light', 'white']), defaults to white
  @api orientation = "vertical"; // oneOf vertical horizontal
  @api dateStyle = DATE_STYLE_DEFAULT; // one of: short medium long full
  @api tag;
  @api image;
  @api imageAlt;
  @api title;
  @api highlight = false;
  @api className;

  @api preventDefault = false;

  /* api: headline */

  _headlineOriginal = "false";
  _headline = false;

  @api
  get headline() {
    return this._headlineOriginal;
  }

  set headline(value) {
    this._headlineOriginal = value;
    this._headline = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: false
    });
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

  get _dateISOString() {
    return this._date ? this._date.toISOString() : null;
  }

  get _dateLocaleString() {
    return this._date
      ? formatDate(
          this._date,
          this.dateStyle || DATE_STYLE_DEFAULT,
          this._userLocale
        )
      : null;
  }

  get computedClassName() {
    return computeClass({
      "nsw-card": true,
      "nsw-card--headline": this._headline,
      "nsw-card--highlight": this.highlight,
      "nsw-card--dark": this.cstyle === "dark",
      "nsw-card--light": this.cstyle === "light",
      "nsw-card--white": this.cstyle === "white",
      "nsw-card--horizontal": this.orientation === "horizontal",
      [this.className]: this.className
    });
  }

  /* methods */

  @api click() {
    const ref = this.refs.link;

    if (ref) {
      ref.click();
    }
  }

  /* event management */

  handleClick(event) {
    if (this.preventDefault) {
      event.preventDefault();
    }

    this.dispatchEvent(
      new CustomEvent("navigate", {
        detail: this.link
      })
    );
  }

  /* lifecycle */

  _userLocale;

  connectedCallback() {
    this._userLocale = getUserLocale();
  }
}
