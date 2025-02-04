import { api, LightningElement } from "lwc";
import { normaliseString } from "c/sfGpsDsHelpers";

const CSTYLE_VALUES = {
  default: "",
  dark: "nsw-media--dark",
  light: "nsw-media--light",
  transparent: "nsw-media--transparent"
};
const CSTYLE_DEFAULT = "default";

const POSITION_VALUES = {
  default: "",
  60: "nsw-media--60",
  70: "nsw-media--70",
  80: "nsw-media--80",
  90: "nsw-media--90",
  "left-30": "nsw-media--left-30",
  "left-40": "nsw-media--left-40",
  "left-50": "nsw-media--left-50",
  "right-30": "nsw-media--right-30",
  "right-40": "nsw-media--right-40",
  "right-50": "nsw-media--right-50"
};
const POSITION_DEFAULT = "default";

export default class extends LightningElement {
  static renderMode = "light";

  @api image;
  @api imageAlt;
  @api video;
  @api videoTitle;
  @api caption;
  @api className;

  /* api: cstyle */

  _cstyle = CSTYLE_VALUES[CSTYLE_DEFAULT];
  _cstyleOriginal = CSTYLE_DEFAULT;

  @api
  get cstyle() {
    return this._cstyleOriginal;
  }

  set cstyle(value) {
    this._cstyleOriginal = value;
    this._cstyle = normaliseString(value, {
      validValues: CSTYLE_VALUES,
      fallbackValue: CSTYLE_DEFAULT,
      returnObjectValue: true
    });
  }

  /* api: position */

  _position = POSITION_VALUES[POSITION_DEFAULT];
  _positionOriginal = POSITION_DEFAULT;

  @api
  get position() {
    return this._positionOriginal;
  }

  set position(value) {
    this._positionOriginal = value;
    this._position = normaliseString(value, {
      validValues: POSITION_VALUES,
      fallbackValue: POSITION_DEFAULT,
      returnObjectValue: true
    });
  }

  /* computed */

  get computedClassName() {
    return {
      "nsw-media": true,
      [this._cstyle]: this._cstyle,
      [this._position]: this._position,
      [this.className]: this.className
    };
  }
}
