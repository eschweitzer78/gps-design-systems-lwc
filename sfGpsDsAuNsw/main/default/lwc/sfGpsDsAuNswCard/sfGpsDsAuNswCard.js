/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api, track } from "lwc";
import { parseIso8601, computeClass } from "c/sfGpsDsHelpers";

const DATE_STYLE_DEFAULT = "medium"; // one of short medium long full, defaults to full

const styleClass = {
  dark: "nsw-card--dark",
  light: "nsw-card--light",
  white: "nsw-card--white"
};
export default class SfGpsDsAuNswCard extends LightningElement {
  @api link;
  // ADJUSTED: style is a reserved keyword in lwc
  @api cstyle = "white"; // PropTypes.oneOf(['dark', 'light', 'white']), defaults to white
  // END ADJUSTED
  @api tag;
  @api image;
  @api imageAlt;
  @api headline;
  @api highlight = false;
  @api className;

  @api dateStyle = DATE_STYLE_DEFAULT; // one of: short medium long full

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
      ? this._date.toLocaleDateString(undefined, {
          dateStyle: this.dateStyle || DATE_STYLE_DEFAULT
        })
      : null;
  }

  get computedClassName() {
    return computeClass({
      "nsw-card": true,
      "nsw-card--headline": this.headline,
      "nsw-card--highlight": this.highlight,
      [styleClass[this.cstyle]]: this.cstyle,
      [this.className]: this.className
    });
  }
}
