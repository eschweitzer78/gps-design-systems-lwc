import { LightningElement, api } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVicTable extends LightningElement {
  static renderMode = "light";

  _headersOriginal;
  _headers;

  @api get headers() {
    return this._headersOriginal;
  }

  set headers(value) {
    this._headersOriginal = value;

    if (!Array.isArray(value)) {
      return;
    }

    this._headers = value.map((header, index) => ({
      ...header,
      key: `header-${index + 1}`
    }));
  }

  _rowsOriginal;
  _rows;

  @api get rows() {
    return this._rowsOriginal;
  }

  set rows(value) {
    this._rowsOriginal = value;

    if (!Array.isArray(value)) {
      return;
    }

    this._rows = value.map((row, index) => ({
      ...row,
      key: `row-${index + 1}`
    }));
  }

  @api className;

  get computedClassName() {
    return computeClass({
      "rpl-table": true,
      [this.className]: this.className
    });
  }

  get isVisible() {
    return this.headers || this.rows;
  }
}
