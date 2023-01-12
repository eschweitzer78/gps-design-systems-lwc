import { LightningElement, api } from "lwc";
import { uniqueId, isExternalUrl, computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVicCardEmergencyContact extends LightningElement {
  @api title;
  @api subtitle;
  @api summary;
  @api link;
  @api className;

  _labelId;

  get computedLabelId() {
    if (this._labelId === undefined) {
      this._labelId = uniqueId("sf-gps-ds-au-vic-card-emergency-card-label");
    }

    return this._labelId;
  }

  get iconSymbol() {
    if (this.link.url.indexOf("tel:") > -1) {
      return "phone_number";
    }

    return isExternalUrl(this.linkUrl)
      ? "external_link"
      : "arrow_right_primary";
  }

  get filterLink() {
    if (this.link.url.indexOf("tel:+") > -1) {
      return this.link.url.replace("tel:+", "tel:");
    }

    return this.link.url;
  }

  get computedClassName() {
    return computeClass({
      "rpl-card-emergency": true,
      [this.className]: this.className
    });
  }
}
