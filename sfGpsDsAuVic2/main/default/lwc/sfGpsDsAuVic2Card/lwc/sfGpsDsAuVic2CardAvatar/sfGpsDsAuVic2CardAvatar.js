import { LightningElement, api } from "lwc";

export default class SfGpsDsAuVic2CardAvatar extends LightningElement {
  @api el = "div";
  @api title;
  @api url;
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
        xs: "square"
      },
      sizes: "xs:148px",
      circle: true
    };
  }

  /* computed */

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
          text: this.title,
          type: "avatar"
        }
      })
    );
  }
}
