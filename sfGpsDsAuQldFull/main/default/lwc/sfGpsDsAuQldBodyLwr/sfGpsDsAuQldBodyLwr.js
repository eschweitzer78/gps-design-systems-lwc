import { api } from "lwc";
import { normaliseString } from "c/sfGpsDsHelpers";
import SfGpsDsLwc from "c/sfGpsDsLwc";

const WIDTH_VALUES = {
  "full-width": "qld__body--full-width",
  "half-width": "qld__body--half-width"
};
const WIDTH_DEFAULT = "full-width";

const CSTYLE_DEFAULT = "default";
const CSTYLE_VALUES = {
  default: "",
  light: "qld__body--light",
  alternate: "qld__body--alt",
  dark: "qld__body--dark",
  "dark-alternate": "qld__body--dark-alt"
};

/**
 * @slot Body
 */
export default class extends SfGpsDsLwc {
  @api container;
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

  /* api: width */

  _width = WIDTH_VALUES[WIDTH_DEFAULT];
  _widthOriginal = WIDTH_DEFAULT;

  @api
  get width() {
    return this._widthOriginal;
  }

  set width(value) {
    this._widthOriginal = value;
    this._width = normaliseString(value, {
      validValues: WIDTH_VALUES,
      fallbackValue: WIDTH_DEFAULT,
      returnObjectValue: true
    });
  }

  /* getters */

  get computedClassName() {
    return {
      qld__body: true,
      [this._width]: this._width,
      [this._cstyle]: this._cstyle,
      [this.className]: this.className
    };
  }

  /* lifecycle */

  connectedCallback() {
    this._isLwrOnly = true;
    super.connectedCallback();
    this.classList.add("qld-scope");
  }
}
