import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuNswStatusLabels extends LightningElement {
  @api label;
  @api status;
  get computedClassName() {
    return computeClass({
      "nsw-status-label": true,
      "nsw-status-label--info": this.status === "info",
      "nsw-status-label--success": this.status === "success",
      "nsw-status-label--warning": this.status === "warning",
      "nsw-status-label--error": this.status === "error"
    });
  }
}
