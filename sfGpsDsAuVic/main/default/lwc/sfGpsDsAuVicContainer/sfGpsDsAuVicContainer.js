import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVicContainer extends LightningElement {
  static renderMode = "light";

  @api className;

  get computedClassName() {
    return computeClass({
      "rpl-container": true,
      [this.className]: this.className
    });
  }
}
