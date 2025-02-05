import { LightningElement, api } from "lwc";
import { normaliseString } from "c/sfGpsDsHelpers";

const THEME_DEFAULT = "light";
const THEME_VALUES = {
  light: "rpl-meta-tag--light",
  dark: "rpl-meta-tag--dark",
  solid: "rpl-meta-tag--solid"
};

export default class extends LightningElement {
  static renderMode = "light";

  @api linkText;
  @api linkUrl;
  @api className;

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
      fallbackValue: THEME_DEFAULT,
      returnObjectValue: true
    });
  }

  /* computed */

  get themeClassName() {
    return {
      "rpl-meta-tag": true,
      [this._theme]: this._theme,
      [this.className]: this.className
    };
  }
}
