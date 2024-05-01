import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVic2PageLinks extends LightningElement {
  @api next;
  @api prev;
  @api className;

  get computedClassName() {
    return computeClass({
      "rpl-page-links": true,
      [this.className]: true
    });
  }
}
