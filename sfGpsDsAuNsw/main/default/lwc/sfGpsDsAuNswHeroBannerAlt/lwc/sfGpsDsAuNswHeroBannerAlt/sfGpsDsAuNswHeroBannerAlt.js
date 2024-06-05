import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuNswHeroBannerAlt extends LightningElement {
  static renderMode = "light";

  @api titleUrl;
  @api titleLabel;
  @api titlePreventDefault = false;
  @api imageSrc;
  @api imageAlt;
  @api className;

  get computedClassName() {
    return computeClass({
      "nsw-hero-banner-alt": true,
      [this.className]: this.className
    });
  }

  handleTitleClick(event) {
    if (this.titlePreventDefault) {
      event.preventDefault();
    }

    this.dispatchEvent(new CustomEvent("click", { detail: event.target.href }));
  }
}
