import { api, LightningElement } from "lwc";
import { replaceInnerHtml, computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVic2Content extends LightningElement {
  @api html;
  @api className;

  get computedClassName() {
    return computeClass({
      "rpl-content": true,
      [this.className]: this.className
    });
  }

  renderedCallback() {
    if (this.html) {
      replaceInnerHtml(this.refs.content, this.html);
    }
  }
}
