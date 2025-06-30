import { 
  LightningElement, 
  api 
} from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

const ID_ABOVE_BODY = "sfgpsds-au-vic2-above-body";
const ID_MAIN = "sfgpsds-au-vic2-main";
const ID_BELOW_BODY = "sfgpsds-au-vic2-below-body";

/**
 * @slot aboveBody
 * @slot main
 * @slot sidebar
 * @slot belowBody
 */
export default 
class SfGpsDsAuVic2StandardPageLayoutLwr
extends LightningElement {
  static renderMode: "light" | "shadow" = "light";

  // @ts-ignore
  @api 
  hasAboveBody = false;

  // @ts-ignore
  @api 
  hasSidebar = false;

  // @ts-ignore
  @api 
  hasBelowBody = false;

  // @ts-ignore
  @api 
  aboveBodyClassName = "";

  // @ts-ignore
  @api 
  bodyClassName = "rpl-grid rpl-grid--no-row-gap rpl-layout__body";

  // @ts-ignore
  @api 
  mainClassName = "rpl-layout__main rpl-col-12";

  // @ts-ignore
  @api 
  sidebarClassName = "rpl-layout__sidebar rpl-col-4-m rpl-col-start-9-m rpl-col-12";

  // @ts-ignore
  @api 
  belowBodyClassName = "";

  get aboveBodyId() {
    return ID_ABOVE_BODY;
  }

  get mainId() {
    return ID_MAIN;
  }

  get belowBodyId() {
    return ID_BELOW_BODY;
  }

  get computedMainClassName() {
    return computeClass({
      "rpl-col-7-m": this.hasSidebar,
      [this.mainClassName]: this.mainClassName
    });
  }
}
