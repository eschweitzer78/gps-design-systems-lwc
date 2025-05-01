import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class extends LightningElement {
  static renderMode = "light";

  @api iconName;
  @api iconColour = "default";
  @api depth = 0;
  @api iconPlacement = "before";
  @api className;

  get computedDepthAboveZero() {
    return this.depth > 0;
  }

  get computedShowIconBefore() {
    return this.iconName && this.iconPlacement === "before";
  }

  get computedShowIconAfter() {
    return this.iconName && this.iconPlacement === "after";
  }

  get computedClassName() {
    return computeClass({
      "rpl-list__icon": true,
      [this.className]: this.className
    });
  }
}
