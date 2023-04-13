import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVicCampaignSecondary extends LightningElement {
  static renderMode = "light";

  @api title;
  @api link;
  @api video;
  @api image;
  @api className;

  // replaced summary attribute by slot

  get computedClassName() {
    return computeClass({
      "rpl-campaign-secondary": true,
      [this.className]: this.className
    });
  }

  get hasMedia() {
    return this.image || this.video;
  }

  get showVideo() {
    return !this.image && this.video;
  }

  get computedVideoVariant() {
    return this.video?.mediaLink ? "link" : false;
  }
}
