import { api, LightningElement } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVic2Expandable extends LightningElement {
  @api expanded = false;
  @api labelledby;
  @api isHidden;
  @api className;

  get computedClassName() {
    return computeClass({
      "rpl-expandable": true,
      "rpl-expandable--open": this.expanded,
      [this.className]: this.className
    });
  }

  get computedStyle() {
    return this.expanded ? "height: auto; overflow: initial" : "height: 0";
  }
}
