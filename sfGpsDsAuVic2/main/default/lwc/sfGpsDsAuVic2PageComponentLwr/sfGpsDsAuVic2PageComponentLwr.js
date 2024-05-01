import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { normaliseBoolean } from "c/sfGpsDsHelpers";

/**
 * @slot Component
 */
export default class SfGpsDsAuVic2PageComponentLwr extends SfGpsDsLwc {
  @api cid;
  @api title;

  _fullWidthOriginal;
  _fullWidth;

  @api get fullWidth() {
    return this._fullWidthOriginal;
  }

  set fullWidth(value) {
    this._fullWidthOriginal = value;
    this._fullWidth = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: false
    });

    if (this._fullWidth) {
      this.classList.add("rpl-page-component--full-width");
    } else {
      this.classList.remove("rpl-page-component--full-width");
    }
  }

  /* lifecycle */

  connectedCallback() {
    this._isLwrOnly = true;
    super.connectedCallback();

    this.classList.add("vic2-scope", "rpl-page-component");
  }
}
