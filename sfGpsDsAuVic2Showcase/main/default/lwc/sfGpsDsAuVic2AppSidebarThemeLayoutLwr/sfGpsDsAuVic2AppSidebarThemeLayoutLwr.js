import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

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

  @api hideMobileSidebar;

  get computedGridClassName() {
    return computeClass({
      [this.gridClassName]: this.gridClassName,
      "docs-hide-mobile-sidebar": this.hideMobileSidebar
    });
  }
}
