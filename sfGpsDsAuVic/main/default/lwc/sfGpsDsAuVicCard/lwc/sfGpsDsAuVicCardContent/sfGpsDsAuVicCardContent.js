import { LightningElement, api } from "lwc";
import {
  isExternalUrl,
  normaliseBoolean,
  computeClass
} from "c/sfGpsDsHelpers";

const BORDER_DEFAULT = false;
const CENTER_DEFAULT = false;

export default class extends LightningElement {
  static renderMode = "light";

  @api link; // { text url }
  @api image;
  @api imageAlt;
  @api focalPoint; // { x y }
  @api width;
  @api height;
  @api type = "default"; // default, simple, inline
  @api className;

  /* api: border */

  _border = BORDER_DEFAULT;
  _borderOriginal = BORDER_DEFAULT;

  @api
  get border() {
    return this._borderOriginal;
  }

  set border(value) {
    this._borderOriginal = value;
    this._border = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: BORDER_DEFAULT
    });
  }

  /* api: center */

  _center = CENTER_DEFAULT;
  _centerOriginal = CENTER_DEFAULT;

  @api
  get center() {
    return this._centerOriginal;
  }

  set center(value) {
    this._centerOriginal = value;
    this._center = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: CENTER_DEFAULT
    });
  }

  /* computed */

  get computedClassName() {
    return computeClass({
      "rpl-card-content": true,
      "rpl-card-content--no-image": !this.image,
      "rpl-card-content--has-border": this._border && !this.image,
      "rpl-card-content--hide-rainbow": this._hidePromoCardRainbow,
      "rpl-card-content--center": this._center && !this.image,
      "rpl-card-content--default": this.type === "default",
      "rpl-card-content--simple": this.type === "simple",
      "rpl-card-content--inline": this.type === "inline",
      "rpl-card-content--has-link-text": this.linkText,
      [this.className]: this.className
    });
  }

  get computedIconSymbol() {
    return isExternalUrl(this.link?.url)
      ? "external_link"
      : "arrow_right_primary";
  }

  get _hidePromoCardRainbow() {
    return false;
    // TODO address and make parameter
  }

  get computedIsInlineLink() {
    return this.link?.text && this.type === "inline";
  }

  get computedIsOfflineLink() {
    return this.link?.text && this.type !== "inline";
  }

  get defaultSrcSet() {
    return "[{ size: 'xs', height: 534, width: 764  }, { size: 's', height: 200, width: 764  }, {  size: 'm', height: 232, width: 448 }, {  size: 'l', height: 232, width: 333 }]";
  }
}
