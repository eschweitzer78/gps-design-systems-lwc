import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuQldAside extends LightningElement {
  static renderMode = "light";

  @api iconName;
  @api iconSize;
  @api className;

  get computedClassName() {
    return computeClass({
      "qg-aside": true,
      [this.className]: this.className
    });
  }
  get computedIconClassName() {
    return computeClass({
      fa: true,
      [`fa-${this.iconName}`]: this.iconName,
      [`fa-${this.iconSize}`]: [
        "2xs",
        "xs",
        "sm",
        "lg",
        "xl",
        "2xl",
        "1x",
        "2x",
        "3x",
        "4x",
        "5x",
        "6x",
        "7x",
        "8x",
        "9x",
        "10x"
      ].includes(this.iconSize)
    });
  }
}
