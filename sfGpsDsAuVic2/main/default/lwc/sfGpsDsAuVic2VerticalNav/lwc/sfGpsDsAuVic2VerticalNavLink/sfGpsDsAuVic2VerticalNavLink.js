import { LightningElement, api } from "lwc";
import { normaliseBoolean, computeClass } from "c/sfGpsDsHelpers";

const ACTIVE_DEFAULT = false;
const PREVENTDEFAULT_DEFAULT = false;

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuVic2VerticalNavLink";

export default class extends LightningElement {
  @api text;
  @api href;
  @api showChildIcon;
  @api tabIndex;
  @api className;

  /* api: active */

  _active = ACTIVE_DEFAULT;
  _activeOriginal = ACTIVE_DEFAULT;

  @api
  get active() {
    return this._activeOriginal;
  }

  set active(value) {
    this._active = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: ACTIVE_DEFAULT
    });
  }

  /* api: preventDefault */

  _preventDefaultOriginal = PREVENTDEFAULT_DEFAULT;
  _preventDefault = PREVENTDEFAULT_DEFAULT;

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

  get computedClassName() {
    return computeClass({
      "rpl-vertical-nav__item": true,
      "rpl-vertical-nav__item--active": this._active,
      "rpl-vertical-nav__link": true,
      "rpl-u-focusable-block": true,
      [this.className]: this.className
    });
  }

  /* event management */

  handleClick(event) {
    if (DEBUG) console.debug(CLASS_NAME, "handleClick", event.target);

    this.dispatchEvent(
      new CustomEvent("itemclick", {
        detail: {
          action: "click",
          text: this.text,
          value: this.href
        }
      })
    );
  }
}
