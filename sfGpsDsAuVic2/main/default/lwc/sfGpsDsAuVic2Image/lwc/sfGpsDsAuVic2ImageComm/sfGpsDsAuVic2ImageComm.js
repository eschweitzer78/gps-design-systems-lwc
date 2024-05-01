import { api } from "lwc";
import {
  IMAGE_DEFAULT,
  IMAGE_DEFAULT_JSON
} from "c/sfGpsDsAuVic2ImageConstants";
import SfGpsDsLwc from "c/sfGpsDsLwc";

export default class SfGpsDsAuVic2ImageComm extends SfGpsDsLwc {
  /* api: image */

  _imageOriginal = IMAGE_DEFAULT_JSON;
  _image = IMAGE_DEFAULT;

  @api
  get image() {
    return this._imageOriginal;
  }

  set image(value) {
    this._imageOriginal = value;

    if (typeof value === "object") {
      this._image = value;
    } else {
      const jsonValue = JSON.parse(value);
      this._image = typeof jsonValue === "object" ? jsonValue : IMAGE_DEFAULT;
    }
  }

  /* computed */

  get computedIsEmpty() {
    return !(this._image.src || this._image.srcSet);
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("vic2-scope");
  }
}
