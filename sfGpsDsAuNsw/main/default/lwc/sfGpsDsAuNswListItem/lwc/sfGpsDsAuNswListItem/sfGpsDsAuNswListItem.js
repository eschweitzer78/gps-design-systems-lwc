/*
 * Copyright (c) 2023-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
import { parseIso8601, getUserLocale, formatDate } from "c/sfGpsDsHelpers";
const DATE_STYLE_SHORT = "short";
const DATE_STYLE_MEDIUM = "medium";
const DATE_STYLE_LONG = "long";
const DATE_STYLE_FULL = "full";
const DATE_STYLE_VALUES = [
  DATE_STYLE_FULL,
  DATE_STYLE_LONG,
  DATE_STYLE_MEDIUM,
  DATE_STYLE_SHORT
];
const DATE_STYLE_DEFAULT = DATE_STYLE_MEDIUM;
const ISBLOCK_DEFAULT = false;
const ISREVERSED_DEFAULT = false;
const SHOWLINK_DEFAULT = false;
const PREVENTDEFAULT_DEFAULT = false;
export default class SfGpsDsAuNswListItem extends SfGpsDsElement {
  static renderMode = "light";
  // @ts-ignore
  @api
  label;
  // @ts-ignore
  @api
  link;
  // @ts-ignore
  @api
  title = "";
  // @ts-ignore
  @api
  image;
  // @ts-ignore
  @api
  imageAlt;
  // @ts-ignore
  @api
  tags;
  // @ts-ignore
  @api
  className;
  // @ts-ignore
  @api
  isBlock;
  _isBlock = this.defineBooleanProperty("isBlock", {
    defaultValue: ISBLOCK_DEFAULT
  });
  // @ts-ignore
  @api
  isReversed;
  _isReversed = this.defineBooleanProperty("isReversed", {
    defaultValue: ISREVERSED_DEFAULT
  });
  // @ts-ignore
  @api
  showLink;
  _showLink = this.defineBooleanProperty("showLink", {
    defaultValue: SHOWLINK_DEFAULT
  });
  // @ts-ignore
  @api
  preventDefault;
  _preventDefault = this.defineBooleanProperty("preventDefault", {
    defaultValue: PREVENTDEFAULT_DEFAULT
  });
  // @ts-ignore
  @api
  dateStyle;
  _dateStyle = this.defineEnumProperty("dateStyle", {
    validValues: DATE_STYLE_VALUES,
    defaultValue: DATE_STYLE_DEFAULT
  });
  /* api: date */
  _date;
  _dateOriginal;
  // @ts-ignore
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
  get _dateISOString() {
    return this._date ? this._date.toISOString() : null;
  }
  get _dateLocaleString() {
    return this._date
      ? formatDate(
          this._date,
          this._dateStyle.value || DATE_STYLE_DEFAULT,
          this._userLocale
        )
      : null;
  }
  get computedClassName() {
    return {
      "nsw-list-item": true,
      "nsw-list-item--block": this._isBlock.value,
      "nsw-list-item--reversed": this._isReversed.value,
      [this.className]: !!this.className
    };
  }
  /* event management */
  handleClick(event) {
    if (this._preventDefault) {
      event.preventDefault();
    }
    this.dispatchEvent(new CustomEvent("navigate", { detail: this.link }));
  }
  /* lifecycle */
  _userLocale;
  connectedCallback() {
    super.connectedCallback();
    this._userLocale = getUserLocale();
  }
}
