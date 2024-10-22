import { LightningElement, api } from "lwc";

/**
 * @slot header
 * @slot widgets
 * @slot footer
 */
export default class extends LightningElement {
  @api containerClassName;
  @api headerClassName;
  @api mainClassName;
  @api footerClassName;

  @api containerBackgroundColor;

  renderedCallback() {
    if (this.containerBackgroundColor) {
      this.refs.container.style.backgroundColor = this.containerBackgroundColor;
    }
  }
}