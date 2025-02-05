import { LightningElement, api } from "lwc";

export default class extends LightningElement {
  @api sourceUrl;
  @api authorName;
  @api className;

  get computedClassName() {
    return {
      "qld__block-quote": true,
      [this.className]: this.className
    };
  }
}
