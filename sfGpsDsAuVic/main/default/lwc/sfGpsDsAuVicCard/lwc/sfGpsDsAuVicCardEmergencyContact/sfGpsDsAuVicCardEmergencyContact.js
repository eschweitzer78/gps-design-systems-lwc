import { LightningElement, api } from "lwc";
import { uniqueId, isExternalUrl, isString } from "c/sfGpsDsHelpers";

export default class extends LightningElement {
  static renderMode = "light";

  @api title;
  @api subtitle;
  @api summary;
  @api link;
  @api className;

  /* computed */

  _labelId;

  get computedAriaLabelledById() {
    if (!this._labelId) {
      this._labelId = uniqueId("sf-gps-ds-au-vic-card-emergency-card-label");
    }

    return this._labelId;
  }

  get _iconSymbol() {
    let rv = "arrow_right_primary";
    const linkUrl = this.link?.url;

    if (isString(linkUrl)) {
      if (linkUrl.indexOf("tel:") > -1) {
        rv = "phone_number";
      } else if (isExternalUrl(linkUrl)) {
        rv = "external_link";
      }
    }

    return rv;
  }

  get _filterLink() {
    if (this.link.url.indexOf("tel:+") > -1) {
      return this.link.url.replace("tel:+", "tel:");
    }

    return this.link.url;
  }

  get computedClassName() {
    return {
      "rpl-card-emergency": true,
      [this.className]: this.className
    };
  }
}
