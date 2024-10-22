import { api } from "lwc";
import { computeClass, normaliseString } from "c/sfGpsDsHelpers";
import SfGpsDsLwc from "c/sfGpsDsLwc";

const WIDTH_FULL = "full-width";
const WIDTH_HALF = "half-width"; // Dropped support (at UX level) until usage pattern is better understood
const WIDTH_VALUES = [WIDTH_FULL, WIDTH_HALF];
const WIDTH_DEFAULT = WIDTH_FULL;

const CSTYLE_DEFAULT = "default";
const CSTYLE_LIGHT = "light";
const CSTYLE_ALT = "alt";
const CSTYLE_DARK = "dark";
const CSTYLE_DARKALT = "dark-alt";
const CSTYLE_VALUES = [
  CSTYLE_DEFAULT,
  CSTYLE_LIGHT,
  CSTYLE_ALT,
  CSTYLE_DARK,
  CSTYLE_DARKALT
];

/**
 * @slot Body
 */
export default class extends SfGpsDsLwc {
  @api container;
  @api className;

  /* api: cstyle */

  _cstyle = CSTYLE_DEFAULT;
  _cstyleOriginal = CSTYLE_DEFAULT;

  @api get cstyle() {
    return this._cstyleOriginal;
  }

  set cstyle(value) {
    this._cstyleOriginal = value;
    this._cstyle = normaliseString(value, {
      validValues: CSTYLE_VALUES,
      fallbackValue: CSTYLE_DEFAULT
    });
  }

  /* api: width */

  _width = WIDTH_DEFAULT;
  _widthOriginal = WIDTH_DEFAULT;

  @api get width() {
    return this._widthOriginal;
  }

  set width(value) {
    this._widthOriginal = value;
    this._width = normaliseString(value, {
      validValues: WIDTH_VALUES,
      fallbackValue: WIDTH_DEFAULT
    });
  }

  /* getters */

  get computedClassName() {
    return computeClass({
      qld__body: true,
      "qld__body--full-width": this._width === WIDTH_FULL,
      "qld__body--half-width": this._width === WIDTH_HALF,
      "qld__body--light": this._cstyle === CSTYLE_LIGHT,
      "qld__body--alt": this._cstyle === CSTYLE_ALT,
      "qld__body--dark": this._cstyle === CSTYLE_DARK,
      "qld__body--dark-alt": this._cstyle === CSTYLE_DARKALT,
      [this.className]: this.className
    });
  }

  get computedIsHalfWidth() {
    return this._width === WIDTH_HALF;
  }

  /* lifecycle */

  connectedCallback() {
    this._isLwrOnly = true;
    super.connectedCallback();

    this.classList.add("qld-scope");
  }
}
