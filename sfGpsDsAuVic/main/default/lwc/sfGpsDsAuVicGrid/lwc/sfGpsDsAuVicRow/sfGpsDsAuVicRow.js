import { LightningElement, api } from "lwc";

export default class extends LightningElement {
  static renderMode = "light";

  @api rowGutter;
  @api className;

  /* computed */

  get computedClassName() {
    return {
      "rpl-row": true,
      "rpl-row--gutter": this.rowGutter,
      [this.className]: this.className
    };
  }
}
