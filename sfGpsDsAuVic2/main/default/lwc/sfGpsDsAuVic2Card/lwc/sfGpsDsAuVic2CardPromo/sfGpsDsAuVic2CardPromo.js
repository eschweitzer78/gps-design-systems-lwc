import { LightningElement, api, track } from "lwc";
import {
  isString,
  isObject,
  normaliseBoolean,
  getCssPropertyValue
} from "c/sfGpsDsHelpers";
import useAccessibleContainer from "c/sfGpsDsAuVic2AccessibleContainer";

export default class extends LightningElement {
  @api el = "div";
  @api highlight;
  @api title;
  @api url;
  @api preventDefault;
  @api className;

  /* api: image */

  _image;
  _imageOriginal;

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
        m: "wide"
      },
      sizes: "sm:768px"
    };
  }

  /* tracked */
  @track _hasMeta;

  /* computed */

  get computedHasImage() {
    return this._image && (this._image.src || this._image.srcSet);
  }

  get computedHighlight() {
    return this._hidePromoCardStripe ? false : this.highlight;
  }

  get computedMetaClassName() {
    return this._hasMeta ? "rpl-card__meta rpl-type-label-small" : null;
  }

  /* event management */

  handleClick() {
    this.dispatchEvent(
      new CustomEvent("navigate", {
        detail: {
          action: "click",
          value: this.url,
          text: this.title,
          type: "promo"
        }
      })
    );

    if (!this.preventDefault) {
      window.location.href = this.url;
    }
  }

  handleSlotChange() {
    this._hasMeta = true;
  }

  /* lifecycle */

  _hidePromoCardStripe;

  connectedCallback() {
    this._hidePromoCardStripe = normaliseBoolean(
      getCssPropertyValue("--sfgpsds-au-vic2-hide-promo-card-stripe")
    );
  }

  _accessibleContainer;

  renderedCallback() {
    if (!this._accessibleContainer) {
      this._accessibleContainer = new useAccessibleContainer(
        this.refs.container,
        this.refs.trigger
      );
    }
  }
}
