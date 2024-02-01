import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

export default class SfGpsDsAuVic2IconComm extends SfGpsDsLwc {
  @api title;
  @api padded;
  @api colour;
  @api size;
  @api name;
  @api className;

  /* computed */

  get computedName() {
    return this.name && this.name.startsWith("icon-")
      ? this.name
      : `icon-${this.name}`;
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("vic2-scope");
  }
}
