import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVic2Sitemap extends LightningElement {
  static renderMode = "light";

  @api items;
  @api className;

  get computedClassName() {
    return computeClass({
      "rpl-sitemap": true,
      [this.className]: this.className
    });
  }
}
