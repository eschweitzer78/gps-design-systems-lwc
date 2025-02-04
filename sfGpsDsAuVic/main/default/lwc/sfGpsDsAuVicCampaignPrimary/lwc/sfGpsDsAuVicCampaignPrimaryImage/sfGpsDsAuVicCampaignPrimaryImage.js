import { LightningElement, api } from "lwc";

export default class extends LightningElement {
  static renderMode = "light";

  @api hasAlt;
  @api image; // { src: string, alt: string }

  /* computed */

  get computedHasNoAlt() {
    return !this.hasAlt;
  }
}
