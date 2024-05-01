import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVic2RelatedLinks extends LightningElement {
  @api title = "Related Links";
  @api items;
  @api className;

  get computedClassName() {
    return computeClass({
      "rpl-related-links": true,
      [this.className]: this.className
    });
  }

  handleClick(event) {
    this.dispatchEvent(
      new CustomEvent("navigate", {
        detail: {
          ...event.detail,
          name: this.title
        },
        bubbles: true
      })
    );
  }
}
