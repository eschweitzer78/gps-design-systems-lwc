import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVicCallToAction extends LightningElement {
  static renderMode = "light";

  @api title;
  // @api summary: replaced by slot
  @api link; // { text: String, link: String }
  @api image; // { src*: String, alt: String, width: Number, height: Number }
  @api cstyle; // string: wide, narrow
  @api className;

  get computedClassName() {
    return computeClass({
      "rpl-call-to-action": true,
      "rpl-call-to-action__no-image": !this.image,
      "rpl-call-to-action--without-sidebar": this.cstyle === "wide",
      "rpl-call-to-action--with-sidebar": this.cstyle === "narrow",
      [this.className]: this.className
    });
  }

  get defaultSrcSet() {
    return [{ size: "xs", height: 249, width: 336 }];
  }
}
