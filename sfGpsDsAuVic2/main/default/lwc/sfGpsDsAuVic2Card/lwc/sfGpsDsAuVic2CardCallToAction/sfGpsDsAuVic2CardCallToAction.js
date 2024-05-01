import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVic2CardCallToAction extends LightningElement {
  @api el;
  @api title;
  @api url;
  @api variant = "filled";
  @api ctaText = "Call to action";
  @api preventDefault;
  @api className;

  /* api: image */

  _imageOriginal;
  _image;

  @api get image() {
    return this._imageOriginal;
  }

  set image(value) {
    this._imageOriginal = value;

    if (typeof value === "string") {
      value = JSON.parse(value);
    }

    if (typeof value !== "object") {
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
}
