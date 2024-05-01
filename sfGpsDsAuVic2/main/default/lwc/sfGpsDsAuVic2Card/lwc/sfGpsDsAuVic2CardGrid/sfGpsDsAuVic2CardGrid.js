import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVic2CardGrid extends LightningElement {
  @api hasSideBar;
  @api className;

  get computedClassName() {
    return computeClass({
      "rpl-layout-card-grid": true,
      "rpl-layout-card-grid--has-sidebar": this.hasSidebar,
      [this.className]: this.className
    });
  }
}
