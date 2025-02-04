import { LightningElement, api, track } from "lwc";
import { isString, isObject } from "c/sfGpsDsHelpers";

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
  }

  handleSlotChange() {
    this._hasMeta = true;
  }

  /* lifecycle */

  _hidePromoCardStripe;

  connectedCallback() {
    const style = getComputedStyle(document.body);
    this._hidePromoCardStripe = style.getPropertyValue(
      "--sfgpsds-au-vic2-hide-promo-card-stripe"
    );
    this.classList.add("sf-gps-ds-au-vic2-grid");
  }
}
