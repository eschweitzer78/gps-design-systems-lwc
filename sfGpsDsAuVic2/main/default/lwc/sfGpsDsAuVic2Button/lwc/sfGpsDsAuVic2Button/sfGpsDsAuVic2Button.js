import { LightningElement, api } from "lwc";
import { normaliseString, normaliseBoolean } from "c/sfGpsDsHelpers";
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
const DISABLED_DEFAULT = false;
const BUSY_DEFAULT = false;
const PREVENTDEFAULT_DEFAULT = false;

export default class extends LightningElement {
  static renderMode = "light";

  @api url = "";
  @api iconName;
  @api label;
  @api className;

  @api ariaBusy;
  @api ariaControls;
  @api ariaSelected;

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

  /* api: disabled */

  _disabled = DISABLED_DEFAULT;
  _disabledOriginal = DISABLED_DEFAULT;

  @api
  get disabled() {
    return this._disabledOriginal;
  }

  set disabled(value) {
    this._disabledOriginal = value;
    this._disabled = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: DISABLED_DEFAULT
    });
  }

  /* api: busy */

  _busy = BUSY_DEFAULT;
  _busyOriginal = BUSY_DEFAULT;

  @api
  get busy() {
    return this._busyOriginal;
  }

  set busy(value) {
    this._busyOriginal = value;
    this._busy = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: BUSY_DEFAULT
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
      acceptString: true,
      fallbackValue: PREVENTDEFAULT_DEFAULT
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
      "rpl-button--busy": this.computedAriaBusy,
      "rpl-button--icon-only-small-screens":
        this._variant === "elevated" && !!this.iconName,
      [this.className]: this.className
    };
  }

  get computedAriaBusy() {
    return this.ariaBusy || this._busy;
  }

  /* methods */

  @api focus() {
    this.refs.item?.focus();
  }

  /* event management */

  handleClick(event) {
    if (this._preventDefault) {
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
