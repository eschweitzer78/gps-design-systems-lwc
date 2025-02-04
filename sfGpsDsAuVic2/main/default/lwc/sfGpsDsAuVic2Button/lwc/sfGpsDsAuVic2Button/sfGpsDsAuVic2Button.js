import { LightningElement, api } from "lwc";
import { normaliseString } from "c/sfGpsDsHelpers";
import {
  RplButtonIconPositions,
  RplButtonThemes,
  RplButtonVariants,
  RplButtonElements
} from "c/sfGpsDsAuVic2ButtonConstants";

const ELEMENT_DEFAULT = "button";
const VARIANT_DEFAULT = "filled";
const ICON_POSITION_DEFAULT = "right";
const THEME_DEFAULT = "default";

export default class SfGpsDsAuVic2Button extends LightningElement {
  @api url = "";
  @api iconName;
  @api label;
  @api disabled = false;
  @api busy = false;
  @api preventDefault;
  @api className;

  /* api: el */

  _el = ELEMENT_DEFAULT;
  _elOriginal = ELEMENT_DEFAULT;

  @api
  get el() {
    return this._elOriginal;
  }

  set el(value) {
    this._elOriginal = value;
    this._el = normaliseString(value, {
      validValues: RplButtonElements,
      fallbackValue: ELEMENT_DEFAULT
    });
  }

  /* api: variant */

  _variant = VARIANT_DEFAULT;
  _variantOriginal = VARIANT_DEFAULT;

  @api
  get variant() {
    return this._variantOriginal;
  }

  set variant(value) {
    this._variantOriginall = value;
    this._variant = normaliseString(value, {
      validValues: RplButtonVariants,
      fallbackValue: VARIANT_DEFAULT
    });
  }

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
      validValues: RplButtonThemes,
      fallbackValue: THEME_DEFAULT
    });
  }

  /* api: iconPosition */

  _iconPositionOriginal = ICON_POSITION_DEFAULT;
  _iconPosition = ICON_POSITION_DEFAULT;

  @api
  get iconPosition() {
    return this._iconPositionOriginal;
  }

  set iconPosition(value) {
    this._iconPositionOriginal = value;
    this._iconPosition = normaliseString(value, {
      validValues: RplButtonIconPositions,
      fallbackValue: ICON_POSITION_DEFAULT
    });
  }

  /* computed */

  get isAnchor() {
    return this.el === "a";
  }

  get computedClassName() {
    return {
      "rpl-button": true,
      [`rpl-button--${this._theme}`]: this._theme,
      [`rpl-button--${this._variant}`]: this._variant,
      "rpl-u-focusable-block": true,
      "rpl-button--reverse": this._iconPosition === "left",
      "rpl-button--busy": this.busy,
      [this.className]: this.className
    };
  }

  /* methods */

  @api focus() {
    this.refs.item?.focus();
  }

  /* event management */

  handleClick(event) {
    if (this.preventDefault) {
      event.preventDefault();
    }

    this.dispatchEvent(
      new CustomEvent("buttonclick", {
        detail: {
          label: this.label,
          url: this.url,
          el: this.el
        }
      })
    );
  }
}
