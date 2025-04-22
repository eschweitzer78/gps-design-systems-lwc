import { LightningElement, api } from "lwc";
import {
  isString,
  isObject,
  computeClass,
  normaliseBoolean
} from "c/sfGpsDsHelpers";
import useAccessibleContainer from "c/sfGpsDsAuVic2AccessibleContainer";

const PREVENTDEFAULT_DEFAULT = false;

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuVic2CardCallToAction";

export default class extends LightningElement {
  @api el;
  @api title;
  @api url;
  @api variant = "filled";
  @api ctaText = "Call to action";
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

  /* api: preventDefault */

  _preventDefault = PREVENTDEFAULT_DEFAULT;
  _preventDefaultOriginal = PREVENTDEFAULT_DEFAULT;

  @api
  get preventDefault() {
    return this._preventDefaultOriginal;
  }

  set preventDefault(value) {
    this._preventDefaultOriginal = value;
    this._preventDefault = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: PREVENTDEFAULT_DEFAULT
    });
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
    if (DEBUG) console.debug(CLASS_NAME, "> handleClick", this._preventDefault);

    if (this._preventDefault) {
      event.preventDefault();
    } else {
      // This bit to cater to useAccessibleContainer simulating a click, as the browser does not automatically navigate to the url
      window.location.href = this.url;
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

    if (DEBUG) console.debug(CLASS_NAME, "< handleClick");
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
