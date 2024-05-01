import { LightningElement, api, track } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVic2CampaignBanner extends LightningElement {
  @api className;
  @track hasMedia = false;
  @track hasAction = false;
  @track hasMeta = false;

  get computedClassName() {
    return computeClass({
      "rpl-campaign-banner": true,
      "rpl-campaign-banner--media": this.hasMedia,
      "rpl-campaign-banner--meta": this.hasMeta,
      [this.className]: this.className
    });
  }

  get computedMediaStyle() {
    return this.hasMedia ? "" : "display: none";
  }

  get computedActionStyle() {
    return this.hasAction ? "" : "display: none";
  }

  get computedMetaStyle() {
    return this.hasMeta ? "" : "display: none";
  }

  /* event management */

  handleSlotChange(event) {
    switch (event.target.name) {
      case "media":
        this.hasMedia = true;
        break;

      case "action":
        this.hasAction = true;
        break;

      case "meta":
        this.hasMeta = true;
        break;

      default:
    }
  }
}
