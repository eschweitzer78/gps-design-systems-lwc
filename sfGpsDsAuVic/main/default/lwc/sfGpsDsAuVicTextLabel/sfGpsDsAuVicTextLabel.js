import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVicTextLabel extends SfGpsDsLwc {
  static renderMode = "light";

  @api underline = false;
  @api theme = "light";
  @api size; //String
  @api emphasis = false;

  get computedClass() {
    return computeClass({
      "rpl-text-label": true,
      "rpl-text-label--dark": this.theme === "dark",
      "rpl-text-label--dark--underline":
        this.theme === "dark" && this.underline,
      "rpl-text-label--small": this.size === "small",
      "rpl-text-label--small--underline":
        this.size === "small" && this.underline,
      "rpl-text-label--large": this.size === "large",
      "rpl-text-label--large--underline":
        this.size === "large" && this.underline,
      "rpl-text-label--emphasis": this.emphasis
    });
  }
}
