import { LightningElement, api } from "lwc";
import { computeClass, isExternalUrl } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVicCardContent extends LightningElement {
  static renderMode = "light";

  @api link; // { text url }
  @api image;
  @api imageAlt;
  @api focalPoint; // { x y }
  @api width;
  @api height;
  @api border = false;
  @api center = false;
  @api type = "default"; // default, simple, inline
  @api className;

  get computedClassName() {
    return computeClass({
      "rpl-card-content": true,
      "rpl-card-content--no-image": !this.image,
      "rpl-card-content--has-border": this.border && !this.image,
      "rpl-card-content--hide-rainbow": this.hidePromoCardRainbow,
      "rpl-card-content--center": this.center && !this.image,
      "rpl-card-content--default": this.type === "default",
      "rpl-card-content--simple": this.type === "simple",
      "rpl-card-content--inline": this.type === "inline",
      "rpl-card-content--has-link-text": this.linkText,
      [this.className]: this.className
    });
  }

  get iconSymbol() {
    return isExternalUrl(this.link?.url)
      ? "external_link"
      : "arrow_right_primary";
  }

  get isImageString() {
    return typeof this.image === "string";
  }

  get hidePromoCardRainbow() {
    return false;
    // TODO address and make parameter
  }

  get isInlineLink() {
    return this.link?.text && this.type === "inline";
  }

  get isOfflineLink() {
    return this.link?.text && this.type !== "inline";
  }

  get defaultSrcSet() {
    return "[{ size: 'xs', height: 534, width: 764  }, { size: 's', height: 200, width: 764  }, {  size: 'm', height: 232, width: 448 }, {  size: 'l', height: 232, width: 333 }]";
  }
}
