/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api, track } from "lwc";
import { parseIso8601 } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuNswCard extends LightningElement {
  @api link;
  // ADJUSTED: style is a reserved keyword in lwc
  @api cstyle = "white"; // PropTypes.oneOf(['dark', 'light', 'white']),
  // END ADJUSTED
  @api tag;
  @api image;
  @api imageAlt;
  @api headline;
  @api highlight = false;
  @api className;

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
    return this._date ? this._date.toLocaleDateString() : null;
  }

  get computedClassName() {
    return `nsw-card nsw-card--${this.cstyle} ${
      this.className ? " " + this.className : ""
    } ${this.headline ? "nsw-card--headline" : ""} ${
      this.highlight ? "nsw-card--highlight" : ""
    }`;
  }
}
