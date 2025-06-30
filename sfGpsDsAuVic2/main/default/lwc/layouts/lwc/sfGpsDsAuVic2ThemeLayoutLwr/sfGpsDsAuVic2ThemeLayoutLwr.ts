import { 
  api 
} from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";

/**
 * @slot header
 * @slot footer
 */
export default class 
SfGpsDsAuVic2ThemeLayoutLwr
extends SfGpsDsElement {
  static renderMode = "light";

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

  renderedCallback() {
    super.renderedCallback?.();

    if (this.containerBackgroundColor && this.refs.container) {
      this.refs.container.style.backgroundColor = this.containerBackgroundColor;
    }
  }
}
