import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVicAcknowledgement extends LightningElement {
  static renderMode = "light";

  @api text;
  @api theme = "default";
  @api aboriginalFlagAltText = "Aboriginal flag";
  @api torresStraitIslanderFlagAltText = "Torres Strait Islander flag";
  @api className;

  /* computed */

  get computedClassName() {
    return computeClass({
      "rpl-acknowledgement": true,
      "rpl-acknowledgement--standalone": this.theme === "standalone",
      "rpl-site-constrain--on-all": this.theme === "standalone",
      [this.className]: this.className
    });
  }
}
