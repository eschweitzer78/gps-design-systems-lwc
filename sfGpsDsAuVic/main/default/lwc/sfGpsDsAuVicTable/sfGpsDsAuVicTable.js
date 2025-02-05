import { LightningElement, api } from "lwc";
import { isArray } from "c/sfGpsDsHelpers";

export default class extends LightningElement {
  static renderMode = "light";

  @api className;

  /* api: headers */

  _headers;
  _headersOriginal;

  @api
  get headers() {
    return this._headersOriginal;
  }

  set headers(value) {
    this._headersOriginal = value;

    if (!isArray(value)) {
      return;
    }

    this._headers = value.map((header, index) => ({
      ...header,
      key: `header-${index + 1}`
    }));
  }

  /* api: rows */

  _rows;
  _rowsOriginal;

  @api
  get rows() {
    return this._rowsOriginal;
  }

  set rows(value) {
    this._rowsOriginal = value;

    if (!isArray(value)) {
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

  /* getters */

  get computedClassName() {
    return {
      "rpl-table": true,
      [this.className]: this.className
    };
  }

  get computedIsVisible() {
    return this.headers || this.rows;
  }
}
