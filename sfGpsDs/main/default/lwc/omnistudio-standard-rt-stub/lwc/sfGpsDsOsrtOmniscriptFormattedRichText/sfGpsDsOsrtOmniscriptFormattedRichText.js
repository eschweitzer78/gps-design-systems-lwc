import { api, LightningElement } from "lwc";
/**
 * OmniScript Formatted Rich Text, extends LightningElement
 */
export default class OmniscriptFormatedRichText extends LightningElement {
  @api value;
  @api disableLinkify;
  get className() {
    return this.class || "";
  }
}
