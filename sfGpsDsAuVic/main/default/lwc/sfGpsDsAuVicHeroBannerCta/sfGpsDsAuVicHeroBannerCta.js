import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVicHeroBannerCta extends LightningElement {
  static renderMode = "light";

  @api title; // string
  @api theme = "light"; // string
  @api introText; // string
  @api linkPrimary; // { link, url }
  @api ctaText; // string
  @api linkSecondary; // { link, url }
  @api className;

  get computedClassName() {
    return computeClass({
      "rpl-hero-banner--cta": true,
      "rpl-site-constrain--on-all": true,
      "rpl-hero-banner--cta-light": this.theme === "light",
      "rpl-hero-banner--cta-dark": this.theme === "dark",
      [this.className]: this.className
    });
  }

  get computedButtonTheme() {
    return this.theme === "light" ? "primary" : "secondary";
  }

  get computedIconColor() {
    return this.theme === "light" ? "primary" : "white";
  }

  get showSecondary() {
    return this.linkSecondary || this.ctaText;
  }
}
