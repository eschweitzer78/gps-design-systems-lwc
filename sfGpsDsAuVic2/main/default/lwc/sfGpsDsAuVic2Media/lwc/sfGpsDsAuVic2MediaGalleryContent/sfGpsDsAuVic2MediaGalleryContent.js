import { LightningElement, api } from "lwc";
import {
  computeClass,
  normaliseBoolean,
  formatTemplate
} from "c/sfGpsDsHelpers";

const SHOW_FULL_SCREEN_DEFAULT = false;
const FULL_SCREEN_LABEL = "View {title} fullscreen";

export default class SfGpsDsAuVic2MediaGalleryContent extends LightningElement {
  @api id;
  @api title;
  @api caption;

  _showFullScreenOriginal = SHOW_FULL_SCREEN_DEFAULT;
  _showFullScreen = SHOW_FULL_SCREEN_DEFAULT;

  @api get showFullScreen() {
    return this._showFullScreenOriginal;
  }

  set showFullScreen(value) {
    this._showFullScreenOriginal = value;
    this._showFullScreen = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: false
    });
  }

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
        xs: "wide"
      },
      sizes: "xs:768px"
    };
  }

  /* computed */

  get computedHasImage() {
    return this._image && (this._image.src || this._image.srcSet);
  }

  get fullScreenLabel() {
    return formatTemplate(FULL_SCREEN_LABEL, { title: this.title });
  }

  get computedAspect() {
    return { xs: "wide" };
  }

  get computedClassName() {
    return computeClass({
      "rpl-media-gallery__content": true,
      [this.className]: this.className
    });
  }

  get computedTitleId() {
    return this.id + "-title";
  }

  get computedCaptionId() {
    return this.id + "-caption";
  }

  handleFullScreen() {
    this.dispatchEvent(
      new CustomEvent("fullscreen", {
        detail: {
          action: "click",
          text: this.fullScreenLabel,
          name: this.title
        }
      })
    );
  }
}
