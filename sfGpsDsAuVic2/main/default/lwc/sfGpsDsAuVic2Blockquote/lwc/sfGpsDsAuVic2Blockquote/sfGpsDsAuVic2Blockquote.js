import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVic2Blockquote extends LightningElement {
  @api authorName;
  @api authorTitle;
  @api className;

  get computedClassName() {
    return computeClass({
      "rpl-blockquote": true,
      [this.className]: this.className
    });
  }
}
