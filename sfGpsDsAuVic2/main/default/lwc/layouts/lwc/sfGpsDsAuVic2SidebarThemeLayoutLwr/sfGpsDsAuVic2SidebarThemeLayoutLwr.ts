import { 
  LightningElement, 
  api 
} from "lwc";

/**
 * @slot header
 * @slot sidebar
 * @slot footer
 */
export default 
class SfGpsDsAuVic2SidebarThemeLayoutLwr 
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
}
