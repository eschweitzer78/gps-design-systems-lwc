import { LightningElement, api } from "lwc";

/**
 * @slot pageHeader
 * @slot main
 */
export default class extends LightningElement {
  @api contentClassName = "docs-content";
}
