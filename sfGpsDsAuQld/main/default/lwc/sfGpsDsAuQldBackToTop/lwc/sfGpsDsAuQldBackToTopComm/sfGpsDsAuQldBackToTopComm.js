import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVic2BlockquoteComm extends SfGpsDsLwc {
  @api label;
  @api className;

  get computedClassName() {
    return computeClass({
      qld__btn: true,
      "qld__btn--floating": true,
      "qld__btn--back-to-top": true,
      [this.className]: this.className
    });
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("qld-scope");
  }
}
