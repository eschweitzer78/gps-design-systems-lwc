import { LightningElement, api } from "lwc";
import { isString, isObject } from "c/sfGpsDsHelpers";
import useAccessibleContainer from "c/sfGpsDsAuVic2AccessibleContainer";

export default class extends LightningElement {
  @api el = "div";
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
        xs: "square"
      },
      sizes: "xs:52px"
    };
  }

  /* computed */

  get computedHasImage() {
    return this._image && (this._image.src || this._image.srcSet);
  }

  /* event management */

  handleClick() {
    this.dispatchEvent(
      new CustomEvent("navigate", {
        detail: {
          action: "click",
          value: this.url,
          text: this.title,
          type: "category-grid"
        }
      })
    );

    if (!this.preventDefault) {
      window.location.href = this.url;
    }
  }

  /* lifecycle */

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
