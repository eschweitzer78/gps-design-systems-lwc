import { LightningElement, api } from "lwc";

/**
 * @slot header
 * @slot footer
 * @slot default
 */
export default class sfGpsDsAuNswLwrThemeLayout extends LightningElement {
  @api containerClassName = "";
  @api headerClassName = "";
  @api mainClassName = "";
  @api footerClassName = "";

  @api containerBackgroundColor;

  renderedCallback() {
    if (this.backgroundColor) {
      this.template.querySelector("[data-container]").style.backgroundColor =
        this.containerBackgroundColor;
    }
  }
}
