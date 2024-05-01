import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVic2Spinner extends LightningElement {
  @api size = "m";
  @api className;

  get computedClassName() {
    return computeClass({
      "rpl-spinner": true,
      [this.className]: this.className
    });
  }
}
