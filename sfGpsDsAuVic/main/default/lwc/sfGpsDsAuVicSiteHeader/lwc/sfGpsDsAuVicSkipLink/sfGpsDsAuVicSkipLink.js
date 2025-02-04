import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class extends LightningElement {
  static renderMode = "light";

  @api title;
  @api skipLinkId;
  @api contentId;
  @api show;
  @api className;

  get computedClassName() {
    return computeClass({
      "rpl-skip-link__link": true,
      "rpl-skip-link__link--show": this.show,
      [this.className]: this.className
    });
  }

  get computedHref() {
    return "#" + this.contentId;
  }
}
