import { api } from "lwc";
import { normaliseString, normaliseBoolean } from "c/sfGpsDsHelpers";
import SfGpsDsLwc from "c/sfGpsDsLwc";

const PADDINGSTYLE_DEFAULT = "full";
const PADDINGSTYLE_VALUES = {
  full: "",
  half: "nsw-section--half-padding",
  none: "nsw-section--no-padding"
};

const COLORSTYLE_DEFAULT = "none";
const COLORSTYLE_VALUES = {
  none: "",
  "brand-dark": "nsw-section--brand-dark",
  "brand-light": "nsw-section--brand-light",
  "brand-supplementary": "nsw-section--brand-supplementary",
  black: "nsw-section--black",
  white: "nsw-section--white",
  "off-white": "nsw-section--off-white",
  "grey-01": "nsw-section--grey-01",
  "grey-02": "nsw-section--grey-02",
  "grey-03": "nsw-section--grey-03",
  "grey-04": "nsw-section--grey-04"
};

const WITHBOX_DEFAULT = false;
const WITHCONTAINER_DEFAULT = false;
const WITHINVERT_DEFAULT = false;

/**
 * @slot Section
 */
export default class extends SfGpsDsLwc {
  static renderMode = "light";

  @api imageSrc;
  @api containerClassName;
  @api className;

  /* api: paddingStyle */

  _paddingStyle = PADDINGSTYLE_VALUES[PADDINGSTYLE_DEFAULT];
  _paddingStyleOriginal = PADDINGSTYLE_DEFAULT;

  @api
  get paddingStyle() {
    return this._paddingStyleOriginal;
  }

  set paddingStyle(value) {
    this._paddingStyleOriginal = value;
    this._paddingStyle = normaliseString(value, {
      validValues: PADDINGSTYLE_VALUES,
      fallbackValue: PADDINGSTYLE_DEFAULT,
      returnObjectValue: true
    });
  }

  /* api: colorStyle */

  _colorStyle = COLORSTYLE_VALUES[COLORSTYLE_DEFAULT];
  _colorStyleOriginal = COLORSTYLE_DEFAULT;

  @api
  get colorStyle() {
    return this._colorStyleOriginal;
  }

  set colorStyle(value) {
    this._colorStyleOriginal = value;
    this._colorStyle =
      COLORSTYLE_VALUES[
        normaliseString(value, {
          validValues: COLORSTYLE_VALUES,
          fallbackValue: COLORSTYLE_DEFAULT
        })
      ];
  }

  /* api: withContainer */

  _withContainer = WITHCONTAINER_DEFAULT;
  _withContainerOriginal = WITHCONTAINER_DEFAULT;

  @api
  get withContainer() {
    return this._withContainerOriginal;
  }

  set withContainer(value) {
    this._withContainerOriginal = value;
    this._withContainer = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: WITHCONTAINER_DEFAULT
    });
  }

  /* api: withBox */

  _withBox = WITHBOX_DEFAULT;
  _withBoxOriginal = WITHBOX_DEFAULT;

  @api
  get withBox() {
    return this._withBoxOriginal;
  }

  set withBox(value) {
    this._withBoxOriginal = value;
    this._withBox = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: WITHBOX_DEFAULT
    });
  }

  /* api: withInvert */

  _withInvert = WITHINVERT_DEFAULT;
  _withInvertOriginal = WITHINVERT_DEFAULT;

  @api
  get withInvert() {
    return this._withInvertOriginal;
  }

  set withInvert(value) {
    this._withInvertOriginal = value;
    this._withInvert = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: WITHINVERT_DEFAULT
    });
  }

  /* computed */

  get computedStyle() {
    return this.imageSrc ? `background-image: url(${this.imageSrc})` : null;
  }

  get computedClassName() {
    return {
      "nsw-section": true,
      [this._paddingStyle]: this._paddingStyle,
      [this._colorStyle]: this._colorStyle,
      "nsw-section--box": this._withBox,
      "nsw-section--invert": this._withInvert,
      "nsw-section--image": this.imageSrc,
      [this.className]: this.className
    };
  }

  get computedContainerClassName() {
    return {
      "nsw-container": this._withContainer,
      [this.containerClassName]: this.containerClassName
    };
  }

  /* lifecycle */

  connectedCallback() {
    this._isLwrOnly = true;
    super.connectedCallback();
    this.classList.add("nsw-scope");
  }
}
