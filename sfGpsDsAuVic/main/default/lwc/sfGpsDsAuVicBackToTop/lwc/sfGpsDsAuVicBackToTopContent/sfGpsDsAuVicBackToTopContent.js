import { LightningElement, api } from "lwc";

export default class extends LightningElement {
  static renderMode = "light";

  @api skipLinkId = "rpl-skip-link";
  @api label = "Back to top";
  @api className;

  @api expected;
  @api show;
  @api sticky;

  /* computed */

  get computedShow() {
    return this.expected || this.show;
  }

  get computedClassName() {
    return {
      "rpl-back-to-top__inner": true,
      "rpl-back-to-top__inner--sticky": this.sticky,
      [this.className]: this.className
    };
  }

  get computedSkipLinkHref() {
    return "#" + this.skipLinkId;
  }
}
