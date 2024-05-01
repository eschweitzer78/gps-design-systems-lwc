import { LightningElement, api } from "lwc";
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
export default class extends LightningElement {
  _hasSidebar = true;
  @api get hasSidebar() {
    return this._hasSidebar;
  }

  set hasSidebar(value) {
    this._hasSidebar = value;
  }

  @api aboveBodyClassName = "";
  @api bodyClassName = "rpl-grid rpl-grid--no-row-gap rpl-layout__body";
  @api mainClassName = "rpl-layout__main rpl-col-12";
  @api sidebarClassName =
    "rpl-layout__sidebar rpl-col-4-m rpl-col-start-9-m rpl-col-12";
  @api belowBodyClassName = "";

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
