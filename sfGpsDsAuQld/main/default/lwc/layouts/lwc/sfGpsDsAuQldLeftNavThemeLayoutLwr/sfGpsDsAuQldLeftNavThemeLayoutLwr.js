import { LightningElement, api } from "lwc";

/**
 * @slot alert
 * @slot header
 * @slot leftNav
 * @slot widgets
 * @slot footer
 */
export default class extends LightningElement {
  static renderMode = "light";

  @api containerClassName;
  @api alertClassName;
  @api headerClassName;
  @api mainClassName;
  @api leftNavClassName;
  @api bodyClassName;
  @api footerClassName;

  @api contentId = "sf-gps-ds-au-qld-left-nav-theme-layout-lwr";
  @api containerBackgroundColor;

  /* lifecycle */

  renderedCallback() {
    if (this.containerBackgroundColor) {
      this.refs.container.style.backgroundColor = this.containerBackgroundColor;
    }
  }
}
