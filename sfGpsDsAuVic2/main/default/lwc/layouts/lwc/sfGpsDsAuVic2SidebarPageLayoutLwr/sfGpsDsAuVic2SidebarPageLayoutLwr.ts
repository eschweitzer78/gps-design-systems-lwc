import { 
  LightningElement, 
  api 
} from "lwc";

const HASSIDEBAR_DEFAULT = true;

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
class SfGpsDsAuVic2SidebarPageLayoutLwr 
extends LightningElement {
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
  sidebarClassName =
    "rpl-layout__sidebar rpl-col-4-m rpl-col-start-9-m rpl-col-12";

  // @ts-ignore
  @api 
  belowBodyClassName = "";

  /* api: hasSideBar */

  _hasSidebar = HASSIDEBAR_DEFAULT;

  // @ts-ignore
  @api
  get hasSidebar() {
    return this._hasSidebar;
  }

  set hasSidebar(value) {
    this._hasSidebar = value;
  }

  /* computed */

  get aboveBodyId() {
    return ID_ABOVE_BODY;
  }

  get mainId() {
    return ID_MAIN;
  }

  get belowBodyId() {
    return ID_BELOW_BODY;
  }

  get computedMainClassName(): any {
    return {
      "rpl-col-7-m": !!this._hasSidebar,
      [this.mainClassName || ""]: !!this.mainClassName
    };
  }
}
