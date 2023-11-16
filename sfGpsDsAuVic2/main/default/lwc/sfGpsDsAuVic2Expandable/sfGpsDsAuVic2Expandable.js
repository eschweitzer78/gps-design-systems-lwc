import { api, LightningElement } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVic2Expandable extends LightningElement {
  @api expanded = false;
  @api addClassName;

  get computedClassName() {
    return computeClass({
      "rpl-expandable": true,
      "rpl-expandable--open": this.expanded,
      [this.addClassName]: this.addClassName
    });
  }

  get computedStyle() {
    return this.expanded ? "height: auto; overflow: initial" : "height: 0";
  }
}
