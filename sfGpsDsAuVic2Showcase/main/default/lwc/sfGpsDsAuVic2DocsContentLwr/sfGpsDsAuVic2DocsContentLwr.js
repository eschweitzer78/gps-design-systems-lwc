import SfGpsDsLwc from "c/sfGpsDsLwc";

/**
 * @slot Content
 */
export default class extends SfGpsDsLwc {
  /* lifecycle */

  connectedCallback() {
    super._isLwrOnly = true;
    super.connectedCallback();
    this.classList.add("vic2-scope");
  }
}
