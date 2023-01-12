import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVicCampaignPrimary extends LightningElement {
  static renderMode = "light";

  @api title;
  // @api summary -- replaced by slot
  @api link; // { url: string, text: string}
  @api image; // { src: string, alt: string }
  @api caption; // string
  @api className;

  get hasAlt() {
    return !!(this.image && this.image.alt);
  }

  get computedClassName() {
    return computeClass({
      "rpl-campaign-primary": true,
      "rpl-campaign-primary--with-caption": !!this.caption,
      [this.className]: this.className
    });
  }
}
