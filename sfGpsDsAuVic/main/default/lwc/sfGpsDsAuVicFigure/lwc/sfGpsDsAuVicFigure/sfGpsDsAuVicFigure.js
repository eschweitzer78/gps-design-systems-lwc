import { LightningElement, api } from "lwc";

export default class extends LightningElement {
  static renderMode = "light";

  @api image;
  @api caption;
  @api source;
  @api className;

  /* computed */

  get computedClassName() {
    return {
      "rpl-figure": true,
      [this.className]: this.className
    };
  }

  get computedShowCaption() {
    return this.caption || this.source;
  }
}
