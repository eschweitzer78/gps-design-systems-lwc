import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

/**
 * @slot Grid-Content
 */
export default class extends SfGpsDsLwc {
  @api hasSidebar;
  @api className;

  /* computed */

  get computedClassName() {
    return {
      "rpl-layout-card-grid": true,
      "rpl-layout-card-grid--has-sidebar": this.hasSidebar,
      [this.className]: this.className
    };
  }

  /* lifecycle */

  connectedCallback() {
    this._isLwrOnly = true;
    super.connectedCallback();

    this.classList.add("vic2-scope");
  }
}
