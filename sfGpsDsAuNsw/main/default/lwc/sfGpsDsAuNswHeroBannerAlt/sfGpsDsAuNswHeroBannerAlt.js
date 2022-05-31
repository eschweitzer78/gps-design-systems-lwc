import { LightningElement, api } from "lwc";

export default class SfGpsDsAuNswHeroBannerAlt extends LightningElement {
    @api titleUrl;
    @api titleLabel;
    @api imageSrc;
    @api imageAlt;
    @api className;

    get computedClassName() {
      return `nsw-hero-banner-alt ${this.className ? this.className : ""}`;
    }
}