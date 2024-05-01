import { LightningElement, api, track } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVic2PageAction extends LightningElement {
  @api className;

  @track _hasUpperSlot;
  @track _hasDefaultSlot;

  get computedClassName() {
    return computeClass({
      "rpl-page-action": true,
      "rpl-u-screen-only": true,
      [this.className]: this.className
    });
  }

  get computedUpperSlotStyle() {
    return this._hasUpperSlot ? "" : "display: none";
  }

  handleSlotChange(event) {
    const target = event.target;

    switch (target.name) {
      case "upper":
        this._hasUpperSlot = true;
        break;

      default:
        this._hasDefaultSlot = true;
    }
  }
}
