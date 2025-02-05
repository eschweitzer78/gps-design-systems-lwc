import { LightningElement, api } from "lwc";
import {
  isString,
  isObject,
  normaliseBoolean,
  computeClass
} from "c/sfGpsDsHelpers";

const HIGHLIGHT_DEFAULT = false;
const INSET_DEFAULT = false;

export default class extends LightningElement {
  @api el = "div";
  @api title;
  @api url;
  @api preventDefault;
  @api className;

  /* api: highlight */

  _highlight = HIGHLIGHT_DEFAULT;
  _highlightOriginal = HIGHLIGHT_DEFAULT;

  @api
  get highlight() {
    return this._highlightOriginal;
  }

  set highlight(value) {
    this._highlightOriginal = value;
    this._highlight = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: HIGHLIGHT_DEFAULT
    });
  }

  /* api: inset */

  _inset = INSET_DEFAULT;
  _insetOriginal = INSET_DEFAULT;

  @api
  get inset() {
    return this._insetOriginal;
  }

  set inset(value) {
    this._insetOriginal = value;
    this._inset = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: INSET_DEFAULT
    });
  }

  /* api: image */

  _imageOriginal;
  _image;

  @api
  get image() {
    return this._imageOriginal;
  }

  set image(value) {
    this._imageOriginal = value;

    if (isString(value)) {
      value = JSON.parse(value);
    }

    if (!isObject(value)) {
      value = {};
    }

    this._image = {
      ...value,
      aspect: {
        xs: "wide",
        s: "ultrawide",
        m: "panorama",
        l: this.highlight ? "panorama" : "full"
      },
      sizes: "xs:768px"
    };
  }

  /* computed */

  get computedHasImage() {
    return this._image && (this._image.src || this._image.srcSet);
  }

  get computedClassName() {
    return computeClass({
      "rpl-card--inset": this._inset,
      [this.className]: this.className
    });
  }

  get computedTitleClassName() {
    return {
      "rpl-card__cta": true,
      "rpl-type-h3": !this._highlight,
      "rpl-type-h3-highlight": this._highlight
    };
  }

  get computedImgClassName() {
    return computeClass({
      "rpl-card__media": true,
      "rpl-card__media--inset": this._inset
    });
  }

  /* event management */

  handleClick() {
    this.dispatchEvent(
      new CustomEvent("navigate", {
        detail: {
          action: "click",
          value: this.url,
          text: this.title,
          type: "nav"
        }
      })
    );
  }

  /* lifecycle */

  connectedCallback() {
    this.classList.add("sf-gps-ds-au-vic2-grid");
  }
}
