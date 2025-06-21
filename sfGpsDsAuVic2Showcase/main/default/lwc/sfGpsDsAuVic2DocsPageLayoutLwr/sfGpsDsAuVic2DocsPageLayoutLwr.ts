import { api } from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";

/**
 * @slot pageHeader
 * @slot main
 */
export default class extends SfGpsDsElement {
  // @ts-ignore
  @api 
  contentClassName = "docs-content";
}
