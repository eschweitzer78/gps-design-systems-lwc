import { LightningElement, api } from "lwc";
import { uniqueId, computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuNswInPageNavigation extends LightningElement {
  static renderMode = "light";

  @api title;
  @api items = []; // Array<{index, text, url}>
  @api firstChild;
  @api className;

  get computedClassName() {
    return computeClass({
      "nsw-in-page-nav": true,
      [this.className]: this.className
    });
  }

  _labelledById;

  get computedAriaLabelledById() {
    if (this._labelledById === undefined) {
      this._labelledById = uniqueId("sf-gps-ds-au-nsw-in-page-nav-label");
    }

    return this._labelledById;
  }
}
