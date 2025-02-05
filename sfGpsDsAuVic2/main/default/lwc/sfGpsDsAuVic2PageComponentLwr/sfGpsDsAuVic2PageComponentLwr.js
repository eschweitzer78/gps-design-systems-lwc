import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { normaliseBoolean } from "c/sfGpsDsHelpers";

const FULLWIDTH_DEFAULT = false;

/**
 * @slot Component
 */
export default class extends SfGpsDsLwc {
  static renderMode = "light";

  @api cid;
  @api title;
  @api className;

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
  }

  /* getters */

  get computedClassName() {
    return {
      "rpl-page-component": true,
      "rpl-page-component--full-width": this._fullWidth,
      [this.className]: this.className
    };
  }
  /* lifecycle */

  connectedCallback() {
    this._isLwrOnly = true;
    super.connectedCallback();
    this.classList.add("vic2-scope", "sf-gps-ds-au-vic2-grid");
  }
}
