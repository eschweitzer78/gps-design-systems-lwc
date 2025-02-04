import { LightningElement, api } from "lwc";

export default class extends LightningElement {
  static renderMode = "light";

  @api className;

  /* computed */

  get computedClassName() {
    return {
      "rpl-container": true,
      [this.className]: this.className
    };
  }
}
