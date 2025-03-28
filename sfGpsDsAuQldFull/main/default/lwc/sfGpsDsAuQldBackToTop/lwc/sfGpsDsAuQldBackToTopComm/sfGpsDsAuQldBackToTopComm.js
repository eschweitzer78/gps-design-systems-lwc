import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

export default class extends SfGpsDsLwc {
  @api label;
  @api className;

  /* computed */

  get computedClassName() {
    return {
      qld__btn: true,
      "qld__btn--floating": true,
      "qld__btn--back-to-top": true,
      [this.className]: this.className
    };
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("qld-scope");
  }
}
