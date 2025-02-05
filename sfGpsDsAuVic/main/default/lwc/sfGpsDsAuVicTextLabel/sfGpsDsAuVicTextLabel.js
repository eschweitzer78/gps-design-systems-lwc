import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { normaliseString, normaliseBoolean } from "c/sfGpsDsHelpers";

const THEME_LIGHT = "light";
const THEME_DARK = "dark";
const THEME_VALUES = [THEME_LIGHT, THEME_DARK];
const THEME_DEFAULT = THEME_LIGHT;

const SIZE_DEFAULT = "default";
const SIZE_SMALL = "small";
const SIZE_LARGE = "large";
const SIZE_VALUES = [SIZE_DEFAULT, SIZE_LARGE, SIZE_SMALL];

const UNDERLINE_DEFAULT = false;
const EMPHASIS_DEFAULT = false;

export default class extends SfGpsDsLwc {
  static renderMode = "light";

  /* api: theme */

  _theme = THEME_DEFAULT;
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

  /* api: size */

  _size = SIZE_DEFAULT;
  _sizeOriginal = SIZE_DEFAULT;

  @api
  get size() {
    return this._sizeOriginal;
  }

  set size(value) {
    this._sizeOriginal = value;
    this._size = normaliseString(value, {
      validValues: SIZE_VALUES,
      fallbackValue: SIZE_DEFAULT
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

  /* api: emphasis */

  _emphasis = EMPHASIS_DEFAULT;
  _emphasisOriginal = EMPHASIS_DEFAULT;

  @api
  get emphasis() {
    return this._emphasisOriginal;
  }

  set emphasis(value) {
    this._emphasisOriginal = value;
    this._emphasis = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: EMPHASIS_DEFAULT
    });
  }

  /* computed */

  get computedClassName() {
    return {
      "rpl-text-label": true,
      "rpl-text-label--dark": this._theme === THEME_DARK,
      "rpl-text-label--dark--underline":
        this._theme === THEME_DARK && this._underline,
      "rpl-text-label--small": this.size === SIZE_SMALL,
      "rpl-text-label--small--underline":
        this.size === SIZE_SMALL && this._underline,
      "rpl-text-label--large": this.size === SIZE_LARGE,
      "rpl-text-label--large--underline":
        this.size === SIZE_LARGE && this._underline,
      "rpl-text-label--emphasis": this._emphasis
    };
  }
}
