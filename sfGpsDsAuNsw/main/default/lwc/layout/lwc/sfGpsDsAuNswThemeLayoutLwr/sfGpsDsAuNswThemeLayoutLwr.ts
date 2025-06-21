import { api } from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement"

/**
 * @slot header
 * @slot NSW-Header
 * @slot footer
 * @slot NSW-Footer
 */
export default 
class sfGpsDsAuNswThemeLayoutLwr
extends SfGpsDsElement {
  static renderMode: "light" | "shadow" = "light";

  // @ts-ignore
  @api 
  containerClassName = "";

  // @ts-ignore
  @api 
  headerClassName = "";

  // @ts-ignore
  @api 
  mainClassName = "";

  // @ts-ignore
  @api 
  footerClassName = "";

  // @ts-ignore
  @api 
  containerBackgroundColor?: string;

  /* lifecycle */

  renderedCallback() {
    super.renderedCallback?.();
    
    if (this.containerBackgroundColor) {
      this.refs.container.style.backgroundColor = this.containerBackgroundColor;
    }
  }
}
