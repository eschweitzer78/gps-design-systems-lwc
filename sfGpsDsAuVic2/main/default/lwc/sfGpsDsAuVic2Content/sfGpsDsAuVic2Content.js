import { api, LightningElement } from "lwc";
import { replaceInnerHtml, computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVic2Content extends LightningElement {
  @api html;
  @api addClassName;

  get computedClassName() {
    return computeClass({
      "rpl-content": true,
      [this.addClassName]: this.addClassName
    });
  }

  renderedCallback() {
    if (this.html) {
      replaceInnerHtml(this.refs.content, this.html);
    }
  }
}
