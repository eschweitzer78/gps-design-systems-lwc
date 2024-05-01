import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class extends LightningElement {
  @api el = "div";
  @api highlight;
  @api inset;
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
      "rpl-card--inset": this.inset === true || this.inset === "true",
      [this.className]: this.className
    });
  }

  get computedTitleClassName() {
    return computeClass({
      "rpl-card__cta": true,
      "rpl-type-h3": this.highlight === false || this.highlight !== "true",
      "rpl-type-h3-highlight":
        this.highlight === true || this.highlight === "true"
    });
  }

  get computedImgClassName() {
    return computeClass({
      "rpl-card__media": true,
      "rpl-card__media--inset": this.inset === true || this.inset === "true"
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
}
