import { LightningElement, api } from "lwc";

/**
 * @slot header
 * @slot sidebar
 * @slot footer
 */
export default class extends LightningElement {
  static renderMode = "light";

  @api themeClassName = "";
  @api headerClassName = "";
  @api contentClassName = "";
  @api containerClassName = "";
  @api gridClassName = "";
  @api sidebarClassName = "";
  @api mainClassName = "";
  @api footerClassName = "";
}
