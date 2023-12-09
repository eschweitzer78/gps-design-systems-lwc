import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { computeClass } from "c/sfGpsDsHelpers";

/**
 * @slot Block
 */
export default class SfGpsDsAuNswBlockLwr extends SfGpsDsLwc {
  static renderMode = "light";

  @api firstChild;
  @api className;

  get computedClassName() {
    return computeClass({
      "nsw-block": true,
      [this.className]: this.className
    });
  }

  /* lifecycle */

  connectedCallback() {
    this._isLwrOnly = true;
    super.connectedCallback();

    this.classList.add("nsw-scope");
  }
}
