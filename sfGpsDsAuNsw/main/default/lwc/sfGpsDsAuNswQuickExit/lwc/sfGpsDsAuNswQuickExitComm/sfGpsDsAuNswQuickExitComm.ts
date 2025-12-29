import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";

export default 
class SfGpsDsAuNswQuickExitComm 
extends SfGpsDsLwc {
  // @ts-ignore
  @api
  safeUrl?: string;

  // @ts-ignore
  @api 
  copy?: string;
  _copyHtml = this.defineMarkdownContentProperty("copy", {
    errorCode: "CO-MD",
    errorText: "Issue when parsing Copy markdown"
  });  
  
  // @ts-ignore
  @api
  enableEsc?: boolean;

  // @ts-ignore
  @api
  enableCloak?: boolean;

  // @ts-ignore
  @api
  focusFirst?: boolean;
  
  // @ts-ignore
  @api 
  className?: string;

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("nsw-scope");
  }
  
  renderedCallback() {
    super.renderedCallback?.();

    if (this._copyHtml.value && this.refs.copy) {
      replaceInnerHtml(this.refs.copy, this._copyHtml.value);
    }
  }
}