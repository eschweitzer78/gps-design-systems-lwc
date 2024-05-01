import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

/**
 * @slot Upper
 * @slot Content
 */
export default class SfGpsDsAuVic2PageActionLwr extends SfGpsDsLwc {
  @api className;

  /* lifecycle */

  connectedCallback() {
    this._isLwrOnly = true;
    super.connectedCallback();

    this.classList.add("vic2-scope");
  }
}
