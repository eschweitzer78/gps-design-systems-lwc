import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { normaliseBoolean } from "c/sfGpsDsHelpers";

const FULLWIDTH_DEFAULT = false;

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuVic2PageComponentLwr";

/**
 * @slot Component
 */
export default class extends SfGpsDsLwc {
  static renderMode = "light";

  @api title;

  /* api: cid */

  _cid;

  @api
  get cid() {
    return this._cid;
  }

  set cid(value) {
    this._cid = value;
    this.id = value;
  }

  /* api: fullWidth */

  _fullWidth = FULLWIDTH_DEFAULT;
  _fullWidthOriginal = FULLWIDTH_DEFAULT;

  @api
  get fullWidth() {
    return this._fullWidthOriginal;
  }

  set fullWidth(value) {
    this._fullWidthOriginal = value;
    this._fullWidth = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: FULLWIDTH_DEFAULT
    });

    if (this._fullWidth) {
      this.classList.add("rpl-page-component--full-width");
    } else {
      this.classList.remove("rpl-page-component--full-width");
    }
  }

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

  /* getters */

  get computedClassName() {
    return {
      [this.className]: this.className
    };
  }
  /* lifecycle */

  connectedCallback() {
    this._isLwrOnly = true;
    super.connectedCallback();
    this.classList.add("rpl-page-component");
  }
}
