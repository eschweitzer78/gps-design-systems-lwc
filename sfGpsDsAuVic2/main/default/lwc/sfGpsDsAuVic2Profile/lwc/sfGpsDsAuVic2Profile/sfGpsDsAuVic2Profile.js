import { LightningElement, api } from "lwc";
import { isString, isObject } from "c/sfGpsDsHelpers";

export default class extends LightningElement {
  @api items;
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
        xs: "square",
        m: "square"
      },
      sizes: "xs:148px",
      circle: true
    };
  }

  /* computed */

  get computedHasImage() {
    return this._image && (this._image.src || this._image.srcSet);
  }

  get computedClassName() {
    return {
      "rpl-profile": true,
      [this.className]: this.className
    };
  }
}
