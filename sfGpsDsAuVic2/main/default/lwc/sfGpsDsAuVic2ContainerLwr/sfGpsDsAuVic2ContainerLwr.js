import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

/**
 * @slot Content
 */
export default class extends SfGpsDsLwc {
  static renderMode = "light";

  @api className;

  get computedClassName() {
    return {
      "rpl-container": true,
      [this.className]: this.className
    };
  }

  connectedCallback() {
    this._isLwrOnly = true;
    super.connectedCallback();

    this.classList.add("vic2-scope", "sf-gps-ds-au-vic2-grid");
  }
}
