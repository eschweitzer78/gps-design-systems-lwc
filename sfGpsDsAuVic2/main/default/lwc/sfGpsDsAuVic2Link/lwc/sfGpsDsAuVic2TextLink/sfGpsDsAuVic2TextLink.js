import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVic2TextLink extends LightningElement {
  @api url;
  @api target;
  @api text;
  @api preventDefault;
  @api className;

  get computedClassName() {
    return computeClass({
      "rpl-text-link": true,
      "rpl-u-focusable-inline": true,
      [this.className]: this.className
    });
  }

  get openInNewWindow() {
    return this.target === "_blank";
  }
}
