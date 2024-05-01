import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { computeClass } from "c/sfGpsDsHelpers";

/**
 * @slot Content
 */
export default class extends SfGpsDsLwc {
  @api className;

  get computedClassName() {
    return computeClass({
      "rpl-container": true,
      [this.className]: this.className
    });
  }

  connectedCallback() {
    this._isLwrOnly = true;
    super.connectedCallback();

    this.classList.add("vic2-scope");
  }
}
