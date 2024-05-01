import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVic2InPageNavigation extends LightningElement {
  @api title = "On this page";
  @api items;
  @api className;

  /* computed */

  get computedClassName() {
    return computeClass({
      "rpl-in-page-navigation": true,
      [this.className]: this.className
    });
  }

  handleItemClick(event) {
    this.dispatchEvent(
      new CustomEvent("navigate", {
        detail: {
          name: this.title,
          ...event.detail
        },
        bubble: false
      })
    );
  }
}
