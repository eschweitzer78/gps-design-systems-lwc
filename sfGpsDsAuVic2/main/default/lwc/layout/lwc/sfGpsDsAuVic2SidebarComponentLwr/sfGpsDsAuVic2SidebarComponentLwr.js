import { LightningElement } from "lwc";

/**
 * @slot Component
 */
export default class extends LightningElement {
  static renderMode = "light";

  /* lifecycle */

  connectedCallback() {
    this._isLwrOnly = true;
    this.classList.add("rpl-sidebar-component");
  }
}
