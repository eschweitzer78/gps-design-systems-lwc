import { LightningElement, api } from "lwc";

export default class SfGpsDsAuNswStatusLabelComm extends LightningElement {
  @api label;
  @api status;
  @api className;

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("nsw-scope");
  }
}
