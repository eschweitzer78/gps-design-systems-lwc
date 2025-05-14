import { LightningElement, api } from "lwc";

/**
 * @slot alert
 * @slot header
 * @slot widgets
 * @slot footer
 */
export default class extends LightningElement {
  static renderMode = "light";

  @api containerClassName;
  @api alertClassName;
  @api headerClassName;
  @api mainClassName;
  @api footerClassName;

  @api containerBackgroundColor;

  /* lifecycle */

  renderedCallback() {
    if (this.containerBackgroundColor) {
      this.refs.container.style.backgroundColor = this.containerBackgroundColor;
    }
  }
}
