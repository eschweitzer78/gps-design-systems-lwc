import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

/**
 * @slot Content
 */
export default class SfGpsDsAuVic2TextLinkComm extends SfGpsDsLwc {
  @api url;
  @api target;
  @api text;
  @api className;

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();

    this.classList.add("vic2-scope");
  }
}
