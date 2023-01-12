import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVicBackToTop extends LightningElement {
  static renderMode = "light";

  @api skipLinkId = "rpl-skip-link";
  @api label = "Back to top";
  @api className;

  @api expected;
  @api show;
  @api sticky;

  get computedShow() {
    return this.expected || this.show;
  }

  get computedClassName() {
    return computeClass({
      "rpl-back-to-top__inner": true,
      "rpl-back-to-top__inner--sticky": this.sticky,
      [this.className]: this.className
    });
  }

  get computedSkipLinkHref() {
    return "#" + this.skipLinkId;
  }
}
