import { api } from "lwc";
import { normaliseString } from "c/sfGpsDsHelpers";
import SfGpsDsLwc from "c/sfGpsDsLwc";

const WIDTH_VALUES = {
  "full-width": { body: "qld__body", width: "qld__body--full-width" },
  "half-width": { body: "qld__body", width: "qld__body--half-width" },
  "custom-class": { body: "qld__body", width: null },
  none: { body: null, width: null }
};
const WIDTH_DEFAULT = "full-width";

const CSTYLE_VALUES = {
  default: "",
  light: "qld__body--light",
  alternate: "qld__body--alt",
  dark: "qld__body--dark",
  "dark-alternate": "qld__body--dark-alt"
};
const CSTYLE_DEFAULT = "default";

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuQldBodyLwr";

/**
 * @slot Body
 */
export default class extends SfGpsDsLwc {
  static renderMode = "light";

  @api container;

  /* api: className */

  _className;

  @api
  get className() {
    return this._className;
  }

  set className(value) {
    if (DEBUG)
      console.debug(CLASS_NAME, "> set className", value, this._className);

    if (this._className) this.classList.remove(...this._className.split(" "));
    this._className = value;
    if (this._className) this.classList.add(...this._className.split(" "));

    if (DEBUG) console.debug(CLASS_NAME, "< set className", this._className);
  }

  /* api: cstyle */

  _cstyle = CSTYLE_VALUES[CSTYLE_DEFAULT];
  _cstyleOriginal = CSTYLE_DEFAULT;

  @api
  get cstyle() {
    return this._cstyleOriginal;
  }

  set cstyle(value) {
    if (DEBUG) console.debug(CLASS_NAME, "> set cstyle", value, this._cstyle);

    if (this._cstyle) this.classList.remove(this._cstyle);
    this._cstyleOriginal = value;

    this._cstyle = normaliseString(value, {
      validValues: CSTYLE_VALUES,
      fallbackValue: CSTYLE_DEFAULT,
      returnObjectValue: true
    });

    if (this._cstyle) this.classList.add(this._cstyle);

    if (DEBUG) console.debug(CLASS_NAME, "< set cstyle", this._cstyle);
  }

  /* api: width */

  _width = WIDTH_VALUES[WIDTH_DEFAULT];
  _widthOriginal = WIDTH_DEFAULT;

  @api
  get width() {
    return this._widthOriginal;
  }

  set width(value) {
    if (DEBUG) console.debug(CLASS_NAME, "> set width", value, this._width);

    if (this._width?.body) this.classList.remove(this._width.body);
    if (this._width?.width) this.classList.remove(this._width.width);

    this._widthOriginal = value;
    this._width = normaliseString(value, {
      validValues: WIDTH_VALUES,
      fallbackValue: WIDTH_DEFAULT,
      returnObjectValue: true
    });
    this.updateClassName();

    if (DEBUG) console.debug(CLASS_NAME, "< set width", this._width);
  }

  /* computed */

  get computedClassName() {
    return {
      [this._width?.body]: this._width?.body,
      [this._width?.width]: this._width?.width,
      [this._cstyle]: this._cstyle,
      [this._className]: this._className
    };
  }

  /* methods */

  updateClassName() {
    if (this._width?.body) this.classList.add(this._width.body);
    if (this._width?.width) this.classList.add(this._width.width);
  }
  /* lifecycle */

  connectedCallback() {
    if (DEBUG) console.debug(CLASS_NAME, "> connectedCallback");
    this._isLwrOnly = true;
    super.connectedCallback();
    this.updateClassName();
    if (DEBUG) console.debug(CLASS_NAME, "< connectedCallback");
  }
}
