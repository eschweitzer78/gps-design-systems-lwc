import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVicFigure extends LightningElement {
  static renderMode = "light";

  @api image;
  @api caption;
  @api source;
  @api className;

  get computedClassName() {
    return computeClass({
      "rpl-figure": true,
      [this.className]: this.className
    });
  }

  get showCaption() {
    return this.caption || this.source;
  }
}
