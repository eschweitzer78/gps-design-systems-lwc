import { LightningElement, api } from "lwc";

/**
 * @slot header
 * @slot footer
 */
export default class extends LightningElement {
  static renderMode = "light";

  @api containerClassName = "";
  @api headerClassName = "";
  @api mainClassName = "";
  @api footerClassName = "";

  @api containerBackgroundColor;

  /* lifecycle */

  renderedCallback() {
    if (this.containerBackgroundColor) {
      this.refs.container.style.backgroundColor = this.containerBackgroundColor;
    }
  }
}
