import { api, LightningElement } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsNswBackToTopContent extends LightningElement {
  static renderMode = "light";

  @api isActive;
  @api isMobile;
  @api className;

  scrollElement = window;

  get computedClassName() {
    return computeClass({
      "nsw-button": true,
      "nsw-button--dark": true,
      "nsw-button--flex": true,
      "nsw-back-to-top": true,
      active: this.isActive,
      [this.className]: this.className
    });
  }

  handleClick(event) {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}
