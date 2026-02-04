import { 
  LightningElement, 
  api 
} from "lwc";

const ID_ABOVE_BODY = "sfgpsds-ca-on-above-body";
const ID_MAIN = "main-content";
const ID_BELOW_BODY = "sfgpsds-ca-on-below-body";

/**
 * @slot aboveBody
 * @slot main
 * @slot belowBody
 */
export default 
class SfGpsDsCaOnStandardPageLayoutLwr
extends LightningElement {
  static renderMode: "light" | "shadow" = "light";

  // @ts-ignore
  @api 
  hasAboveBody = false;

  // @ts-ignore
  @api 
  aboveBodyClassName = "";

  // @ts-ignore
  @api 
  mainId = ID_MAIN;

  // @ts-ignore
  @api 
  mainClassName = "";

  // @ts-ignore
  @api 
  hasBelowBody = false;

  // @ts-ignore
  @api 
  belowBodyClassName = "";

  get aboveBodyId() {
    return ID_ABOVE_BODY;
  }

  get belowBodyId() {
    return ID_BELOW_BODY;
  }
}
