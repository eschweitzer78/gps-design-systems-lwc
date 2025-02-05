import { LightningElement, api } from "lwc";

export default class extends LightningElement {
  static renderMode = "light";

  @api title;
  @api link;
  @api video;
  @api image;
  @api className;

  // replaced summary attribute by slot

  /* computed */

  get computedClassName() {
    return {
      "rpl-campaign-secondary": true,
      [this.className]: this.className
    };
  }

  get computedHasMedia() {
    return this.image || this.video;
  }

  get computedVideoVariant() {
    return this.video?.mediaLink ? "link" : false;
  }
}
