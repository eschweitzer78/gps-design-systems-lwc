/*
 * Copyright (c) 2023-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api 
} from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
import {
  parseIso8601,
  getUserLocale,
  formatDate
} from "c/sfGpsDsHelpers";

import type { 
  DateStyle 
} from "c/sfGpsDsAuNswListItem";
import type { 
  Link 
} from "c/sfGpsDsMarkdown";

const DATE_STYLE_SHORT: DateStyle = "short";
const DATE_STYLE_MEDIUM: DateStyle = "medium";
const DATE_STYLE_LONG: DateStyle = "long";
const DATE_STYLE_FULL: DateStyle = "full";
const DATE_STYLE_VALUES: DateStyle[] = [
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

export default 
class SfGpsDsAuNswListItem 
extends SfGpsDsElement {
  static renderMode: "light" | "shadow" = "light";

  // @ts-ignore
  @api 
  label?: string;

  // @ts-ignore
  @api 
  link?: string;

  // @ts-ignore
  @api 
  title = "";

  // @ts-ignore
  @api 
  image?: string;

  // @ts-ignore
  @api 
  imageAlt?: string;

  // @ts-ignore
  @api 
  tags?: Link[];

  // @ts-ignore
  @api 
  className?: string;

  // @ts-ignore
  @api 
  isBlock?: boolean;
  _isBlock = this.defineBooleanProperty("isBlock", {
    defaultValue: ISBLOCK_DEFAULT
  });

  // @ts-ignore
  @api 
  isReversed?: boolean;
  _isReversed = this.defineBooleanProperty("isReversed", {
    defaultValue: ISREVERSED_DEFAULT
  });


  // @ts-ignore
  @api 
  showLink?: boolean;
  _showLink = this.defineBooleanProperty("showLink", {
    defaultValue: SHOWLINK_DEFAULT
  });

  // @ts-ignore
  @api 
  preventDefault?: boolean;
  _preventDefault = this.defineBooleanProperty("preventDefault", {
    defaultValue: PREVENTDEFAULT_DEFAULT
  });

  // Added as we made the mistake of renaming preventClickDefault to preventDefault when migrating to TS
  // @ts-ignore
  @api 
  get preventClickDefault() {
    return this.preventDefault;
  }

  set preventClickDefault(value) {
    this.preventDefault = value;
  }

  // @ts-ignore
  @api 
  dateStyle?: DateStyle;
  _dateStyle = this.defineEnumProperty<DateStyle>("dateStyle", {
    validValues: DATE_STYLE_VALUES,
    defaultValue: DATE_STYLE_DEFAULT
  });

  /* api: date */

  _date?: Date;
  _dateOriginal?: Date | string;

  // @ts-ignore
  @api
  get date(): Date | string | undefined {
    return this._dateOriginal;
  }

  set date(value: Date | string) {
    this._dateOriginal = value;

    if (value instanceof Date) {
      this._date = value;
    } else {
      this._date = value ? parseIso8601(value.toString()) : undefined;
    }
  }

  get _dateISOString(): string | undefined {
    return this._date 
      ? this._date.toISOString() 
      : undefined;
  }

  get _dateLocaleString(): string | undefined {
    return this._date
      ? formatDate(
          this._date,
          this._dateStyle.value || DATE_STYLE_DEFAULT,
          this._userLocale
        )
      : undefined;
  }

  get computedClassName(): any {
    return {
      "nsw-list-item": true,
      "nsw-list-item--block": this._isBlock.value,
      "nsw-list-item--reversed": this._isReversed.value,
      [this.className || ""]: !!this.className
    };
  }

  /* event management */

  handleClick(
    event: MouseEvent
  ): void {
    if (this._preventDefault) {
      event.preventDefault();
    }

    this.dispatchEvent(new CustomEvent("navigate", { detail: this.link }));
  }

  /* lifecycle */

  _userLocale?: string;

  connectedCallback() {
    super.connectedCallback?.();
    this._userLocale = getUserLocale();
  }
}
