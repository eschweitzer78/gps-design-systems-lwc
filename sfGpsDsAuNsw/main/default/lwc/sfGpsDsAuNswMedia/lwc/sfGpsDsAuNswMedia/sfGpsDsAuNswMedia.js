import { api, LightningElement } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuNswMedia extends LightningElement {
  static renderMode = "light";

  @api cstyle;
  @api image;
  @api imageAlt;
  @api video;
  @api videoTitle;
  @api caption;
  @api position;
  @api className;

  get computedClassName() {
    return computeClass({
      "nsw-media": true,
      "nsw-media--dark": this.cstyle === "dark",
      "nsw-media--light": this.cstyle === "light",
      "nsw-media--transparent": this.cstyle === "transparent",
      "nsw-media--90": this.position === "90",
      "nsw-media--80": this.position === "80",
      "nsw-media--70": this.position === "70",
      "nsw-media--60": this.position === "60",
      "nsw-media--left-50": this.position === "left-50",
      "nsw-media--right-50": this.position === "right-50",
      "nsw-media--left-40": this.position === "left-40",
      "nsw-media--right-40": this.position === "right-40",
      "nsw-media--left-30": this.position === "left-30",
      "nsw-media--right-30": this.position === "right-30",
      [this.className]: this.className
    });
  }
}
