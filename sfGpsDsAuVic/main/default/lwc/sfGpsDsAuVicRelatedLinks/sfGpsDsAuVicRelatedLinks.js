import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVicRelatedLinks extends LightningElement {
  static renderMode = "light";

  @api title; // string
  @api links; // array of {url: string, text: string}
  @api className;

  get computedClassName() {
    return computeClass({
      "rpl-related-links": true,
      [this.className]: this.className
    });
  }

  get _links() {
    return Array.isArray(this.links)
      ? this.links.map((item, index) => ({
          ...item,
          key: `link-${index + 1}`
        }))
      : null;
  }
}
