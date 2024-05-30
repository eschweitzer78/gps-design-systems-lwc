import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVic2PaginationLink extends LightningElement {
  @api iconName;
  @api iconSize;
  @api iconPlacement;
  @api disabled;
  @api className;

  get computedIsIconBefore() {
    return this.iconPlacement === "before";
  }

  get computedIsIconAfter() {
    return this.iconPlacement === "after";
  }

  get computedClassName() {
    return computeClass({
      "rpl-pagination__link": true,
      "rpl-type-p": true,
      "rpl-u-focusable-inline": true,
      [this.className]: this.className
    });
  }
}
