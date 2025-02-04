import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import {
  normaliseBoolean,
  normaliseString,
  isExternalUrl,
  computeClass
} from "c/sfGpsDsHelpers";

const INNERWRAP_DEFAULT = true;
const UNDERLINE_DEFAULT = false;

const THEME_LIGHT = "light";
const THEME_DARK = "dark";
const THEME_VALUES = [THEME_DARK, THEME_LIGHT];
const THEME_DEFAULT = THEME_LIGHT;

export default class extends SfGpsDsLwc {
  static renderMode = "light";

  @api iconSymbol; // String
  @api iconColor = "primary";
  @api iconPlacement = "after";
  @api iconSize = "m";
  @api size; // String
  @api emphasis = false;
  @api className;

  /* api: innerWrap */

  _innerWrap = INNERWRAP_DEFAULT;
  _innerWrapOriginal = INNERWRAP_DEFAULT;

  @api
  get innerWrap() {
    return this._innerWrapOriginal;
  }

  set innerWrap(value) {
    this._innerWrapOriginal = value;
    this._innerWrap = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: INNERWRAP_DEFAULT
    });
  }

  /* api: underline */

  _underline = UNDERLINE_DEFAULT;
  _underlineOriginal = UNDERLINE_DEFAULT;

  @api
  get underline() {
    return this._underlineOriginal;
  }

  set underline(value) {
    this._underlineOriginal = value;
    this._underline = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: UNDERLINE_DEFAULT
    });
  }

  /* api: theme */

  _theme = THEME_VALUES[THEME_DEFAULT];
  _themeOriginal = THEME_DEFAULT;

  @api
  get theme() {
    return this._themeOriginal;
  }

  set theme(value) {
    this._themeOriginal = value;
    this._theme = normaliseString(value, {
      validValues: THEME_VALUES,
      fallbackValue: THEME_DEFAULT
    });
  }

  /* api: link */

  _link;
  _isExternalUrl = false;

  @api
  get link() {
    return this._link;
  }

  set link(value) {
    this._link = value;
    this._isExternalUrl = isExternalUrl(this.link?.url);
  }

  /* api: text, alternative way of setting link */

  @api
  get text() {
    return this._link?.text;
  }

  set text(value) {
    // eslint-disable-next-line @lwc/lwc/no-api-reassignments
    this._link = { ...this._link, text: value };
  }

  /* api: url, alternative way of setting link */

  @api
  get url() {
    return this._link?.url;
  }

  set url(value) {
    // eslint-disable-next-line @lwc/lwc/no-api-reassignments
    this.link = { ...this.link, url: value };
    this._isExternalUrl = isExternalUrl(value);
  }

  /* computed */

  get computedTextDecoded() {
    return this._link ? this._link.text : "";
  }

  get computedIconSymbol() {
    return this._isExternalUrl ? "external_link" : this.iconSymbol;
  }

  get computedClassName() {
    return computeClass({
      "rpl-text-link": true,
      "rpl-text-link--underline": this._underline,
      "rpl-text-link--dark": this._theme === "dark",
      [this.className]: this.className
    });
  }
}
