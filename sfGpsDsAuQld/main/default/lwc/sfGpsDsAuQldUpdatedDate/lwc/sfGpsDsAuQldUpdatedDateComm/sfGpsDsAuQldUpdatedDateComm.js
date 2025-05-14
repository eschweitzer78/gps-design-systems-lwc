import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

export default class extends SfGpsDsLwc {
  @api date;
  @api className;

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();

    this.classList.add("qld-scope");
  }
}
