import { LightningElement, api } from "lwc";

export default class extends LightningElement {
  @api label;
  @api status;
  @api className;

  /* lifecycle */

  connectedCallback() {
    this.classList.add("nsw-scope");
  }
}
