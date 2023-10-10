import { api, track } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

/**
 * @slot Content-Region
 */

export default class SfGpsDsAuNswContainerLwr extends SfGpsDsLwc {
  static renderMode = "light";

  @api containerClassName;
  @track isAura = false;

  /* lifecycle */

  connectedCallback() {
    // eslint-disable-next-line dot-notation
    if (window["$A"] !== undefined && window["$A"] !== null) {
      this.isAura = true;
      this.addError("CO-AU", "Not compatible with Aura runtime.");
    }

    this.classList.add("nsw-scope");
  }
}
