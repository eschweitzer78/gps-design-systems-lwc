import { LightningElement, api } from "lwc";
import { normaliseBoolean, computeClass } from "c/sfGpsDsHelpers";

const ACTIVE_DEFAULT = false;

export default class extends LightningElement {
  @api text;
  @api href;
  @api showChildIcon;
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

  handleClick() {
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
