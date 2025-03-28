import { LightningElement, api } from "lwc";
import { uniqueId } from "c/sfGpsDsHelpers";

export default class extends LightningElement {
  static renderMode = "light";

  @api title;
  @api items = []; // Array<{index, text, url}>
  @api className;

  /* computed */

  get computedClassName() {
    return {
      "qld__inpage-nav-links": true,
      [this.className]: this.className
    };
  }

  _labelledById;

  get computedAriaLabelledById() {
    if (this._labelledById === undefined) {
      this._labelledById = uniqueId("sf-gps-ds-au-qld-in-page-nav-heading");
    }

    return this._labelledById;
  }
}
