import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuQldAlert extends LightningElement {
  static renderMode = "light";

  @api type;
  @api title;
  @api className;

  get computedClassName() {
    return computeClass({
      alert: true,
      "alert-info": this.type === "info",
      "alert-success": this.type === "success",
      "alert-warning": this.type === "warning",
      "alert-danger": this.type === "danger",
      "qg-primary-content_notice": true,
      [this.className]: this.className
    });
  }

  get computedIconClassName() {
    return computeClass({
      fa: true,
      "fa-info-circle": this.type === "info",
      "fa-check": this.type === "success",
      "fa-exclamation-triangle": this.type === "warning",
      "fa-times-circle": this.type === "danger"
    });
  }
}
