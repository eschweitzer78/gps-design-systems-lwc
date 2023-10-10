import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuQldCard extends LightningElement {
  static renderMode = "light";

  @api titleLink;

  @api imageSrc;
  @api imageAlt;
  @api isThumbnail;

  @api ctaLink;
  @api ctaStyle; // one of secondary, outline-dark, link

  @api className;

  get computedClassName() {
    return computeClass({
      "qg-card": true,
      "qg-card__light-theme": this.theme === "light",
      "qg-card__clickable": this.titleLink && this.titleLink.url,
      [this.className]: this.clasName
    });
  }

  get computedImageClassName() {
    return this.isThumbnail ? "qg-card__thumbnail" : null;
  }

  get computedCtaClassName() {
    return computeClass({
      "qg-btn": true,
      "btn-secondary": this.ctaStyle === "secondary",
      "btn-outline-dark": this.ctaStyle === "outline-dark",
      "btn-link": this.ctaStyle === "link"
    });
  }
}
