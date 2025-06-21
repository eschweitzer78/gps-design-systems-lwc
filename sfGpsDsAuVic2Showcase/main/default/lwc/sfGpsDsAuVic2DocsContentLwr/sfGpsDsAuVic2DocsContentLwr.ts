import SfGpsDsLwc from "c/sfGpsDsLwc";

/**
 * @slot Content
 */
export default 
class SfGpsDsAuVic2DocsContentLwr 
extends SfGpsDsLwc {
  /* lifecycle */

  constructor() {
    super(true); // isLwrOnly
  }
  
  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("vic2-scope");
  }
}
