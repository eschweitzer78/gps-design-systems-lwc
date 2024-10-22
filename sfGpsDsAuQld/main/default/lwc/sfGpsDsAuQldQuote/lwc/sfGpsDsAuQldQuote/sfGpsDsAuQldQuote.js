import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class extends LightningElement {
  @api sourceUrl;
  @api authorName;
  @api className;

  get computedClassName() {
    return computeClass({
      "qld__block-quote": true,
      [this.className]: this.className
    });
  }
}
