import { LightningElement, api } from "lwc";
import { computeClass, normaliseString } from "c/sfGpsDsHelpers";

const ELEMENT_ANCHOR = "a";
const ELEMENT_BUTTON = "button";
const ELEMENT_VALUES = [ELEMENT_ANCHOR, ELEMENT_BUTTON];
const ELEMENT_DEFAULT = ELEMENT_BUTTON;

const VARIANT_PRIMARY = "primary";
const VARIANT_SECONDARY = "secondary";
const VARIANT_TERTIARY = "tertiary";
const VARIANT_VALUES = [VARIANT_PRIMARY, VARIANT_SECONDARY, VARIANT_TERTIARY];
const VARIANT_DEFAULT = VARIANT_PRIMARY;

const ICONPOSITION_LEAD = "lead";
const ICONPOSITION_TRAIL = "trail";
const ICONPOSITION_VALUES = [ICONPOSITION_LEAD, ICONPOSITION_TRAIL];
const ICONPOSITION_DEFAULT = ICONPOSITION_LEAD;

export default class SfGpsDsAuQldButton extends LightningElement {
  @api label;
  @api url = "";
  @api iconName;
  @api disabled = false;
  @api preventDefault;
  @api className;

  /* api: el */

  _elOriginal = ELEMENT_DEFAULT;
  _el = ELEMENT_DEFAULT;

  @api get el() {
    return this._elOriginal;
  }

  set el(value) {
    this._elOriginal = value;
    this._el = normaliseString(value, {
      validValues: ELEMENT_VALUES,
      fallbackValue: ELEMENT_DEFAULT
    });
  }

  /* api: variant */

  _variantOriginal = VARIANT_DEFAULT;
  _variant = VARIANT_DEFAULT;

  @api get variant() {
    return this._variantOriginal;
  }

  set variant(value) {
    this._variantOriginall = value;
    this._variant = normaliseString(value, {
      validValues: VARIANT_VALUES,
      fallbackValue: VARIANT_DEFAULT
    });
  }

  /* api: iconPosition */

  _iconPositionOriginal = ICONPOSITION_DEFAULT;
  _iconPosition = ICONPOSITION_DEFAULT;

  @api get iconPosition() {
    return this._iconPositionOriginal;
  }

  set iconPosition(value) {
    this._iconPositionOriginal = value;
    this._iconPosition = normaliseString(value, {
      validValues: ICONPOSITION_VALUES,
      fallbackValue: ICONPOSITION_DEFAULT
    });
  }

  /* computed */

  get computedIsAnchor() {
    return this.el === ELEMENT_ANCHOR;
  }

  get computedIsIconLeading() {
    return this.iconName && this._iconPosition === ICONPOSITION_LEAD;
  }

  get computedIsIconTrailing() {
    return this.iconName && this._iconPosition === ICONPOSITION_TRAIL;
  }

  get computedClassName() {
    return computeClass({
      qld__btn: true,
      "qld__btn--secondary": this._variant === VARIANT_SECONDARY,
      "qld__btn--tertiary": this._variant === VARIANT_TERTIARY,
      "qld__btn--icon-lead": this._iconPosition === ICONPOSITION_LEAD,
      "qld__btn--icon-trail": this._iconPosition === ICONPOSITION_TRAIL,
      [this.className]: this.className
    });
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
