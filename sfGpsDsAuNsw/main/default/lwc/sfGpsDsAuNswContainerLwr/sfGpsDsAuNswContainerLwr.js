import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

/**
 * @slot Container
 */
export default class SfGpsDsAuNswContainerLwr extends SfGpsDsLwc {
  static renderMode = "light";

  @api containerClassName;

  /* lifecycle */

  connectedCallback() {
    this._isLwrOnly = true;
    super.connectedCallback();

    this.classList.add("nsw-scope");
  }
}
