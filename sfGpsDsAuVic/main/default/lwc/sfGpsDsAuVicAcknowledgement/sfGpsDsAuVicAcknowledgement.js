import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVicAcknowledgement extends LightningElement {
  @api text;
  @api theme = "default";
  @api aboriginalFlagAltText = "Aboriginal flag";
  @api torresStraitIslanderFlagAltText = "Torres Strait Islander flag";

  get computedClass() {
    return (
      "rpl-acknowledgement" + (this.themeClass ? " " + this.themeClass : "")
    );
  }

  get themeClass() {
    return computeClass({
      "rpl-acknowledgement--standalone rpl-site-constrain--on-all":
        this.theme === "standalone"
    });
  }
}
