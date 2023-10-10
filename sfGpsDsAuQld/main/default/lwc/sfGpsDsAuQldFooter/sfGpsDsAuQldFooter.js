import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuQldFooter extends LightningElement {
  static renderMode = "light";

  @api items;
  @api copyrightMention;
  @api className;

  _numberColumnsOriginal = 3;
  _numberColumns = 3;

  @api get numberColumns() {
    return this._numberColumnsOriginal;
  }

  set numberColumns(value) {
    this._numberColumnsOriginal = value;

    if (typeof value !== "number") {
      value = parseInt(value.toString(), 10);
      if (isNaN(value)) {
        value = 3;
      }
    }

    this._numberColumns = Math.max(Math.min(value, 3), 1);
  }

  get showCol1() {
    return this._numberColumns > 0;
  }

  get showCol2() {
    return this._numberColumns > 1;
  }

  get showCol3() {
    return this._numberColumns > 2;
  }

  get computedClassName() {
    return computeClass({
      "qg-site-footer": true,
      [this.className]: this.className
    });
  }

  get computedColClassName() {
    return `col col-md-${12 / this._numberColumns}`;
  }
}
