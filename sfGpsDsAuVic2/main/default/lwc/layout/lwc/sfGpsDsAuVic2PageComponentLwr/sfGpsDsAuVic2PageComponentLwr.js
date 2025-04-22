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

    if (this._fullWidth) {
      this.classList.add("rpl-page-component--full-width");
    } else {
      this.classList.remove("rpl-page-component--full-width");
    }
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
    this.classList.add("vic2-scope", "rpl-page-component");
  }
}
