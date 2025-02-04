import { api, LightningElement } from "lwc";

export default class extends LightningElement {
  static renderMode = "light";

  @api isActive;
  @api isMobile;
  @api className;

  /* computed */

  get computedClassName() {
    return {
      "nsw-button": true,
      "nsw-button--dark": true,
      "nsw-button--flex": true,
      "nsw-back-to-top": true,
      active: this.isActive,
      [this.className]: this.className
    };
  }

  /* event management */

  handleClick(event) {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}
