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
  DateStyle, 
  Orientation, 
  CStyle 
} from "c/sfGpsDsAuNswCardV2";

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

type OrientationValues = Record<Orientation, string>;

const ORIENTATION_VALUES: OrientationValues = {
  vertical: "",
  horizontal: "nsw-card--horizontal"
};
const ORIENTATION_DEFAULT: Orientation = "vertical";

type CStyleValues = Record<CStyle, string>; 

const CSTYLE_VALUES: CStyleValues = {
  white: "nsw-card--white",
  dark: "nsw-card--dark",
  light: "nsw-card--light"
};
const CSTYLE_DEFAULT: CStyle = "white";

const HIGHLIGHT_DEFAULT = false;
const HEADLINE_DEFAULT = false;
const PREVENTDEFAULT_DEFAULT = false;

export default 
class sfGpsDsAuNswCardV2
extends SfGpsDsElement {
  static renderMode: "light" | "shadow" = "light";

  // @ts-ignore
  @api 
  title: string = "";

  // @ts-ignore
  @api 
  link?: string;

  // @ts-ignore
  @api 
  tag?: string;

  // @ts-ignore
  @api 
  image?: string;

  // @ts-ignore
  @api 
  imageAlt?: string;

  // @ts-ignore
  @api 
  className?: string;

  // @ts-ignore
  @api 
  preventDefault?: boolean;
  _preventDefault = this.defineBooleanProperty("preventDefault", {
    defaultValue: PREVENTDEFAULT_DEFAULT
  });

  // @ts-ignore
  @api 
  headline?: boolean;
  _headline = this.defineBooleanProperty("headline", {
    defaultValue: HEADLINE_DEFAULT
  });

  // @ts-ignore
  @api
  cstyle?: CStyle;
  _cstyle = this.defineEnumObjectProperty<string, CStyle>("cstyle", {
    validValues: CSTYLE_VALUES,
    defaultValue: CSTYLE_DEFAULT
  });

  // @ts-ignore
  @api
  orientation?: string;
  _orientation = this.defineEnumObjectProperty<string, Orientation>("orientation", {
    validValues: ORIENTATION_VALUES,
    defaultValue: ORIENTATION_DEFAULT
  });

  // @ts-ignore
  @api 
  highlight?: boolean;
  _highlight = this.defineBooleanProperty("highlight", {
    defaultValue: HIGHLIGHT_DEFAULT
  });

  // @ts-ignore
  @api
  dateStyle?: DateStyle;
  _dateStyle = this.defineEnumProperty<DateStyle>("dateStyle", {
    validValues: DATE_STYLE_VALUES,
    defaultValue: DATE_STYLE_DEFAULT
  });

  /* api: date */

  _date?: Date;
  _dateOriginal?: string | Date;

  // @ts-ignore
  @api
  get date(): string | Date | undefined {
    return this._dateOriginal;
  }

  set date(value: string | Date) {
    this._dateOriginal = value;

    if (value instanceof Date) {
      this._date = value;
    } else {
      this._date = value 
        ? parseIso8601(value.toString()) 
        : undefined;
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
          this._dateStyle.value as DateStyle || DATE_STYLE_DEFAULT,
          this._userLocale
        )
      : undefined;
  }

  /* computed */

  get computedClassName(): any {
    return {
      "nsw-card": true,
      "nsw-card--headline": this._headline.value,
      "nsw-card--highlight": this._highlight.value,
      [this._cstyle.value]: !!this._cstyle.value,
      [this._orientation.value]: !!this._orientation.value,
      [this.className || ""]: !!this.className
    };
  }

  /* methods */

  // @ts-ignore
  @api
  click(): void {
    const ref = this.refs.link;

    if (ref) {
      ref.click();
    }
  }

  /* event management */

  handleClick(event: MouseEvent): void {
    if (this._preventDefault.value) {
      event.preventDefault();
    }

    this.dispatchEvent(new CustomEvent("navigate", { 
      detail: this.link 
    }));
  }

  /* lifecycle */

  _userLocale?: string;

  connectedCallback() {
    super.connectedCallback?.();
    this._userLocale = getUserLocale();
  }
}
