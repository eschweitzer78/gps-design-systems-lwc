import { LightningElement, api } from "lwc";

const ID_SKIP_LINKS = "sfgpsds-on-ca-skip-links";
const ID_ABOVE_HEADER = "sfgpsds-on-ca-above-header";
const ID_HEADER = "sfgpsds-on-ca-header";
const ID_BELOW_HEADER = "sfgpsds-on-ca-below-header";

/**
 * @slot aboveHeader
 * @slot header
 * @slot belowHeader
 * @slot footer
 */
export default 
class SfGpsDsCaOnStandardThemeLayoutLwr 
extends LightningElement {
  static renderMode: "light" | "shadow" = "light";

  // @ts-ignore
  @api 
  skipToContentLabel = "Skip to main content";

  // @ts-ignore
  @api 
  hasAboveHeader?: boolean;

  // @ts-ignore
  @api 
  hasHeader?: boolean;

  // @ts-ignore
  @api 
  hasBelowHeader?: boolean;

  // @ts-ignore
  @api 
  themeClassName = "";

  // @ts-ignore
  @api 
  layoutClassName = "";

  // @ts-ignore
  @api 
  aboveHeaderClassName = "";
  // @ts-ignore
  @api 
  headerClassName = "";
  // @ts-ignore
  @api 
  belowHeaderClassName = "";
  // @ts-ignore
  @api 
  footerClassName = "";

  // @ts-ignore
  @api 
  mainId = "main-content";

  get skipLinksId() {
    return ID_SKIP_LINKS;
  }

  get aboveHeaderId() {
    return ID_ABOVE_HEADER;
  }

  get headerId() {
    return ID_HEADER;
  }

  get belowHeaderId() {
    return ID_BELOW_HEADER;
  }
}
