import { LightningElement, api } from "lwc";

export default class SfGpsDsAuVic2LayoutSkipLink extends LightningElement {
  @api targetId;

  get computedHref() {
    return `#${this.targetId}`;
  }
}
