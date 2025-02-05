import { LightningElement, api } from "lwc";
import {
  parseIso8601,
  getUserLocale,
  formatDate,
  normaliseString,
  normaliseBoolean
} from "c/sfGpsDsHelpers";

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

export default class extends LightningElement {
  static renderMode = "light";

  @api label;
  @api link;
  @api title;
  @api image;
  @api imageAlt;
  @api tags;
  @api className;

  /* api: isBlock */

  _isBlock = ISBLOCK_DEFAULT;
  _isBlockOriginal = ISBLOCK_DEFAULT;

  @api
  get isBlock() {
    return this._isBlockOriginal;
  }

  set isBlock(value) {
    this._preventDefaultOriginal = value;
    this._preventDefault = normaliseBoolean(value, {
      acceptString: false,
      fallbackValue: ISBLOCK_DEFAULT
    });
  }

  /* api: isReversed */

  _isReversed = ISREVERSED_DEFAULT;
  _isReversedOriginal = ISREVERSED_DEFAULT;

  @api
  get isReversed() {
    return this._isReversedOriginal;
  }

  set isReversed(value) {
    this._isReversedOriginal = value;
    this._isReversed = normaliseBoolean(value, {
      acceptString: false,
      fallbackValue: ISREVERSED_DEFAULT
    });
  }

  /* api: showLink */

  _showLink = SHOWLINK_DEFAULT;
  _showLinkOriginal = SHOWLINK_DEFAULT;

  @api
  get showLink() {
    return this._showLinkOriginal;
  }

  set showLink(value) {
    this._showLinkOriginal = value;
    this._showLink = normaliseBoolean(value, {
      acceptString: false,
      fallbackValue: SHOWLINK_DEFAULT
    });
  }

  /* api: preventDefault */

  _preventDefault = PREVENTDEFAULT_DEFAULT;
  _preventDefaultOriginal = PREVENTDEFAULT_DEFAULT;

  @api
  get preventDefault() {
    return this._preventDefaultOriginal;
  }

  set preventDefault(value) {
    this._preventDefaultOriginal = value;
    this._preventDefault = normaliseBoolean(value, {
      acceptString: false,
      fallbackValue: PREVENTDEFAULT_DEFAULT
    });
  }

  /* api: dateStyle */

  _dateStyle;
  _dateStyleOriginal;

  @api
  get dateStyle() {
    return this._dateStyleOriginal;
  }

  set dateStyle(value) {
    this._dateStyleOriginal = value;
    this._dateStyle = normaliseString(value, {
      validValues: DATE_STYLE_VALUES,
      fallbackValue: DATE_STYLE_DEFAULT
    });
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

  get _dateISOString() {
    return this._date ? this._date.toISOString() : null;
  }

  get _dateLocaleString() {
    /*
    return this._date
      ? this._date.toLocaleDateString(this._userLocale, {
          dateStyle: this.dateStyle || DATE_STYLE_DEFAULT
        })
      : null;
    */
    return this._date
      ? formatDate(
          this._date,
          this._dateStyle || DATE_STYLE_DEFAULT,
          this._userLocale
        )
      : null;
  }

  get computedClassName() {
    return {
      "nsw-list-item": true,
      "nsw-list-item--block": this._isBlock,
      "nsw-list-item--reversed": this._isReversed,
      [this.className]: this.className
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
    this._userLocale = getUserLocale();
  }
}
