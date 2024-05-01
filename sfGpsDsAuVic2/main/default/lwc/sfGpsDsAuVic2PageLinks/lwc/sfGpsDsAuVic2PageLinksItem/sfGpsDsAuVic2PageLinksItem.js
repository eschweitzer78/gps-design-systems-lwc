import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVic2PageLinksItem extends LightningElement {
  @api direction;
  @api label;
  @api url;
  @api className;

  get computedClassName() {
    return computeClass({
      "rpl-page-links__item": true,
      [this.className]: this.className
    });
  }

  get computedName() {
    return this.direction === "prev" ? "icon-arrow-left" : "icon-arrow-right";
  }
}
