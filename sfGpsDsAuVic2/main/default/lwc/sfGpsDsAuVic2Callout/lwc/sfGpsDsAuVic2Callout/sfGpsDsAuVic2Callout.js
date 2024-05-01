import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVic2Callout extends LightningElement {
  @api title;
  @api variant;
  @api className;

  get computedClassName() {
    return computeClass({
      "rpl-callout": true,
      "rpl-callout--neutral": this.variant === "neutral",
      [this.className]: this.className
    });
  }
}
