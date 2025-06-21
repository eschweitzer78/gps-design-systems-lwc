import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

/**
 * @slot header
 * @slot VIC-Header
 * @slot sidebar
 * @slot VIC-Sidebar
 * @slot footer
 * @slot VIC-Footer
 */
export default 
class SfGpsDsAuVic2AppSidebarThemeLayoutLwr
extends LightningElement {
  static renderMode: "light" | "shadow" = "light";

  // @ts-ignore
  @api 
  themeClassName = "";

  // @ts-ignore
  @api 
  headerClassName = "";

  // @ts-ignore
  @api 
  contentClassName = "";

  // @ts-ignore
  @api 
  containerClassName = "";

  // @ts-ignore
  @api 
  gridClassName = "";

  // @ts-ignore
  @api 
  sidebarClassName = "";

  // @ts-ignore
  @api 
  mainClassName = "";

  // @ts-ignore
  @api 
  footerClassName = "";

  // @ts-ignore
  @api 
  hideMobileSidebar = false;

  get computedGridClassName() {
    return computeClass({
      [this.gridClassName || ""]: !!this.gridClassName,
      "docs-hide-mobile-sidebar": this.hideMobileSidebar
    });
  }
}
