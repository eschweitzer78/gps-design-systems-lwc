import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class extends LightningElement {
  @api label;
  @api iconName;
  @api iconColour;
  @api className;

  get computedClassName() {
    return computeClass({
      "rpl-card__status": true,
      [this.className]: this.className
    });
  }
}
