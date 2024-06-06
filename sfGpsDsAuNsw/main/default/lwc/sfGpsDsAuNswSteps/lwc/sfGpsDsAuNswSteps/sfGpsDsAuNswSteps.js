import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsNswSteps extends LightningElement {
  static renderMode = "light";

  @api type;
  @api cstyle;
  @api firstChild;
  @api className;

  get computedClassName() {
    return computeClass({
      "nsw-steps": true,
      "nsw-steps--dark": this.cstyle === "dark",
      "nsw-steps--light": this.cstyle === "light",
      "nsw-steps--supplementary": this.cstyle === "supplementary",
      "nsw-steps--fill": this.type?.includes("fill"),
      "nsw-steps--counters": this.type?.includes("counter"),
      [this.className]: this.className
    });
  }
}
