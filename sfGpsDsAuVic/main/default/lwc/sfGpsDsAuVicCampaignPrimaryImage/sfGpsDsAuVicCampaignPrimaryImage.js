import { LightningElement, api } from "lwc";

export default class SfGpsDsAuVicCampaignPrimaryImage extends LightningElement {
  static renderMode = "light";

  @api hasAlt;
  @api image; // { src: string, alt: string }

  get computedHasNoAlt() {
    return !this.hasAlt;
  }
}
