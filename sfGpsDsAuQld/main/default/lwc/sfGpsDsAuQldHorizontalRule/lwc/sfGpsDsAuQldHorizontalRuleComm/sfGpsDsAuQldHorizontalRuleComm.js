import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

export default class extends SfGpsDsLwc {
  @api size;
  @api className;

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("qld-scope");
  }
}
