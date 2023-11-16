import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVic2Acknowledgement extends LightningElement {
  @api addClassName;
  @api message;

  get computedClassName() {
    return computeClass({
      "rpl-acknowledgement": true,
      "rpl-u-screen-only": true,
      [this.addClassName]: this.addClassName
    });
  }
}
