import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuQldCallout extends LightningElement {
  static renderMode = "light";

  @api title;
  @api theme; // one of grey, default
  @api buttonLink;
  @api imageSrc;
  @api imageAlt;
  @api className;

  get computedClassName() {
    return computeClass({
      "qg-callout__box": true,
      "qg-callout__default-theme": this.theme === "default",
      "qg-callout__grey-theme": this.theme === "grey",
      [this.className]: this.className
    });
  }

  get computedAlignmentClass() {
    return computeClass({
      "qg-callout__bottom-alignment": this.showButton,
      "qg-callout__right-alignment": this.showImage
    });
  }

  get showButton() {
    return this.buttonLink && this.buttonLink.url;
  }

  get showImage() {
    return this.imageSrc && !this.showButton;
  }
}
