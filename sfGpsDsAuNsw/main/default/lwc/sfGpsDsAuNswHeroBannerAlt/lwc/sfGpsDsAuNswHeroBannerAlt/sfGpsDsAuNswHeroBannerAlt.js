import { LightningElement, api } from "lwc";
import { normaliseBoolean } from "c/sfGpsDsHelpers";

const TITLEPREVENTDEFAULT_DEFAULT = false;

export default class extends LightningElement {
  static renderMode = "light";

  @api titleUrl;
  @api titleLabel;
  @api imageSrc;
  @api imageAlt;
  @api className;

  /* api: titlePreventDefault */

  _titlePreventDefault = TITLEPREVENTDEFAULT_DEFAULT;
  _titlePreventDefaultOriginal = TITLEPREVENTDEFAULT_DEFAULT;

  @api
  get titlePreventDefault() {
    return this._titlePreventDefaultOriginal;
  }

  set titlePreventDefault(value) {
    this._titlePreventDefaultOriginal = value;
    this._titlePreventDefault = normaliseBoolean(value, {
      acceptString: false,
      fallbackValue: TITLEPREVENTDEFAULT_DEFAULT
    });
  }

  /* computed */

  get computedClassName() {
    return {
      "nsw-hero-banner-alt": true,
      [this.className]: this.className
    };
  }

  /* event management */

  handleTitleClick(event) {
    if (this._titlePreventDefault) {
      event.preventDefault();
    }

    this.dispatchEvent(
      new CustomEvent("navclick", { detail: event.target.href })
    );
  }
}
