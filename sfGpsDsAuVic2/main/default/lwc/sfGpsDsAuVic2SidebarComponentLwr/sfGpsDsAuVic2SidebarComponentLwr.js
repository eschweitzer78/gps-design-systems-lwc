import { LightningElement } from "lwc";

/**
 * @slot Component
 */
export default class SfGpsDsAuVic2SidebarComponent extends LightningElement {
  /* lifecycle */

  connectedCallback() {
    this._isLwrOnly = true;
    this.classList.add("rpl-sidebar-component");
  }
}
