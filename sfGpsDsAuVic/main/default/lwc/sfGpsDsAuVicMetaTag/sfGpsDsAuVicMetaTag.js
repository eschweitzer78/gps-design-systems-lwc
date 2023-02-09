import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVicMetaTag extends LightningElement {
  static renderMode = "light";

  @api linkText;
  @api linkUrl;
  @api theme;
  @api className;

  get themeClass() {
    return computeClass({
      "rpl-meta-tag": true,
      "rpl-meta-tag--light": this.theme !== "solid" && this.theme !== "dark",
      "rpl-meta-tag--solid": this.theme === "solid",
      "rpl-meta-tag--dark": this.theme === "dark",
      [this.className]: this.className
    });
  }
}
