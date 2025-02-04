import { LightningElement, api } from "lwc";
import { isString, isObject, computeClass } from "c/sfGpsDsHelpers";

export default class extends LightningElement {
  @api title;
  @api link;
  @api className;
  @api preventDefault;

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
        l: "wide"
      },
      sizes: "xs:992px md:328px"
    };
  }

  /* computed */

  get computedHasImage() {
    return this._image && (this._image.src || this._image.srcSet);
  }

  get computedClassName() {
    return computeClass({
      "rpl-campaign-banner--secondary": true,
      [this.className]: this.className
    });
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
          label: this.title,
          text: this.link?.text,
          value: this.link?.url,
          options: [this.image, this.link],
          type: "secondary"
        }
      })
    );
  }
}
