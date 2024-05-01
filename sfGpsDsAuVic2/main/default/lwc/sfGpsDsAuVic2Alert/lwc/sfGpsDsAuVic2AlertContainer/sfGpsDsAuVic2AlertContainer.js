import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVic2AlertContainer extends LightningElement {
  @api className;

  get computedClassName() {
    return computeClass({
      "rpl-alert-container": true,
      [this.className]: this.className
    });
  }
}
