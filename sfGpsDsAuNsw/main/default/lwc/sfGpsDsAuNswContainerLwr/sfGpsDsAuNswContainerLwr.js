import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { computeClass } from "c/sfGpsDsHelpers";

/**
 * @slot Container
 */
export default class SfGpsDsAuNswContainerLwr extends SfGpsDsLwc {
  static renderMode = "light";

  @api mode = "Default";
  @api containerClassName;

  get computedContainerClassName() {
    return computeClass({
      "nsw-container": true,
      "nsw-container--flush": this.mode === "Flush",
      [this.containerClassName]: this.containerClassName
    });
  }

  /* lifecycle */

  connectedCallback() {
    this._isLwrOnly = true;
    super.connectedCallback();

    this.classList.add("nsw-scope");
  }
}
