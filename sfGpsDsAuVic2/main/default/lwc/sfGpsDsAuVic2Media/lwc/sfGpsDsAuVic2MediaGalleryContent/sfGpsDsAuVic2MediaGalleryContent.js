import { LightningElement, api } from "lwc";
import {
  normaliseBoolean,
  formatTemplate,
  isString,
  isObject
} from "c/sfGpsDsHelpers";

const SHOW_FULL_SCREEN_DEFAULT = false;
const FULL_SCREEN_LABEL = "View {title} fullscreen";

export default class extends LightningElement {
  @api id;
  @api title;
  @api caption;
  @api className;

  /* api: showFullScreen */

  _showFullScreen = SHOW_FULL_SCREEN_DEFAULT;
  _showFullScreenOriginal = SHOW_FULL_SCREEN_DEFAULT;

  @api
  get showFullScreen() {
    return this._showFullScreenOriginal;
  }

  set showFullScreen(value) {
    this._showFullScreenOriginal = value;
    this._showFullScreen = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: false
    });
  }

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
    return {
      "rpl-media-gallery__content": true,
      [this.className]: this.className
    };
  }

  get computedTitleId() {
    return this.id + "-title";
  }

  get computedCaptionId() {
    return this.id + "-caption";
  }

  /* event management */

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
