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

    this._rows = value.map((row, rindex) => ({
      ...row,
      key: `row-${rindex + 1}`,
      cols: row.map((col, cindex) => ({
        ...col,
        key: `cell-${rindex + 1}-${cindex + 1}`
      }))
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
