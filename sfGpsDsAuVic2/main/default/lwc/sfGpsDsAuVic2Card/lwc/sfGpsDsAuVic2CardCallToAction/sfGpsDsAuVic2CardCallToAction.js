import { LightningElement, api } from "lwc";
import { isString, isObject, computeClass } from "c/sfGpsDsHelpers";

export default class extends LightningElement {
  @api el;
  @api title;
  @api url;
  @api variant = "filled";
  @api ctaText = "Call to action";
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
        m: "panorama",
        l: "full"
      },
      sizes: "xs:768px"
    };
  }

  /* computed */

  get computedClassName() {
    return computeClass({
      "rpl-card--inset": true,
      [this.className]: this.className
    });
  }

  get computedHasImage() {
    return this._image && (this._image.src || this._image.srcSet);
  }

  /* event management */

  handleClick(event) {
    if (this.preventDefault) {
      event.preventDefault();
    }

    this.dispatchEvent(
      new CustomEvent("navigate", {
        detail: {
          action: "click",
          value: this.url,
          label: this.title,
          text: this.ctaText,
          type: "call-to-action"
        }
      })
    );
  }

  /* lifecycle */

  connectedCallback() {
    this.classList.add("sf-gps-ds-au-vic2-grid");
  }
}
