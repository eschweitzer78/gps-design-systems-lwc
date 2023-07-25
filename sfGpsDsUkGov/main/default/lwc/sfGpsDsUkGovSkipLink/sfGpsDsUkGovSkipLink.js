import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsUkGovSkipLink extends LightningElement {
  static renderMode = "light";

  @api title;
  @api skipLinkId;
  @api contentId;
  // @api show;
  @api className;

  get computedClassName() {
    return computeClass({
      "govuk-skip-link": true,
      [this.className]: this.className
    });
  }

  get computedHref() {
    return "#" + this.contentId;
  }
}
