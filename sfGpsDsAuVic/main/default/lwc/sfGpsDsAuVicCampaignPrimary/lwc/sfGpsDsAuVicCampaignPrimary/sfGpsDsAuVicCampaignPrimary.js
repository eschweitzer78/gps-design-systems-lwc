import { LightningElement, api } from "lwc";

export default class extends LightningElement {
  static renderMode = "light";

  @api title;
  // @api summary -- replaced by slot
  @api link; // { url: string, text: string}
  @api image; // { src: string, alt: string }
  @api caption; // string
  @api className;

  /* computed */

  get _hasAlt() {
    return !!(this.image && this.image.alt);
  }

  get computedClassName() {
    return {
      "rpl-campaign-primary": true,
      "rpl-campaign-primary--with-caption": this.caption,
      [this.className]: this.className
    };
  }
}
