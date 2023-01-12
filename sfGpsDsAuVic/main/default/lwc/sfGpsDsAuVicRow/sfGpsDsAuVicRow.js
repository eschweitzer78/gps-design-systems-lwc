import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVicRow extends LightningElement {
  static renderMode = "light";

  @api rowGutter;
  @api className;

  get computedClassName() {
    return computeClass({
      "rpl-row": true,
      "rpl-row--gutter": this.rowGutter,
      [this.className]: this.className
    });
  }
}
