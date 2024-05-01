import SfGpsDsLwc from "c/sfGpsDsLwc";
import { api } from "lwc";

export default class SfGpsDsAuVic2TagComm extends SfGpsDsLwc {
  @api label;
  @api variant;
  @api className;

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();

    this.classList.add("vic2-scope");
  }
}
