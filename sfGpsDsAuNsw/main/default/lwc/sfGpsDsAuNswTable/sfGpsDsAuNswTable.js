/*
 * Copyright (c) 2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api, track } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuNswTable extends LightningElement {
  @api caption;
  @api captionLocation;
  @api isStriped = false;
  @api isBordered = false;

  @api offset;
  @api limit;

  @api className;

  /* api content */

  _originalContent;
  _attributes = new Set();
  @track _content;

  @api get content() {
    return this._originalContent;
  }

  set content(value) {
    this._originalContent = value;
    this._attributes = new Set();

    if (value == null) {
      value = [];
    }
    if (!Array.isArray(value)) {
      value = [value];
    }

    this._content = value.map((row, rowIndex) => {
      let nRow = {
        _key: `row-${rowIndex + 1}`
      };

      for (let colName in row) {
        if (Object.hasOwn(row, colName)) {
          if (!colName.startsWith("_")) {
            let col = row[colName];
            this._attributes.add(colName);

            if (col !== null && typeof col === "object") {
              nRow[colName] = {
                ...col,
                _key: colName,
                _isMarkdown: col.type === "markdown",
                _isString: col.type === "string",
                _isNumber: col.type === "number",
                _isBoolean: col.type === "boolean",
                _isReference: col.type === "reference"
              };
            } else {
              let type = col != null ? typeof col : "string";
              nRow[colName] = {
                _key: colName,
                value: col,
                type: type,
                _isString: type === "string",
                _isNumber: type === "number",
                _isBoolean: type === "boolean"
              };
            }
          }
        }
      }

      return nRow;
    });
  }

  /* api headers */

  _headersOriginal;
  _headers;

  @api get headers() {
    return this._headersOriginal;
  }

  set headers(value) {
    this._headersOriginal = value;

    if (!Array.isArray(value)) {
      value = null;
    }

    this._headers = value;
  }

  /* computed */

  get _tableHeaders() {
    return (
      this._headers ||
      Array.from(this._attributes.keys()).map((attr) => ({
        name: attr,
        label: attr
      }))
    );
  }

  get _tableRows() {
    if (this._content == null) {
      return null;
    }

    let headers = this._tableHeaders;
    let offset = this.offset || 0;
    let limit = this.limit || this._content.length || 0;

    let content = this._content.slice(offset, offset + limit);

    return content.map((row, index) => ({
      _key: `row-${index + 1}`,
      _cols: headers.map((header) => row[header.name] || {})
    }));
  }

  get computedClassName() {
    return computeClass({
      "nsw-table": true,
      "nsw-table--striped": this.isStriped,
      "nsw-table--bordered": this.isBordered,
      "nsw-table--caption-top": this.captionLocation === "top",
      [this.className]: this.className
    });
  }

  get computedShowCaption() {
    return this.captionLocation !== "none";
  }
}
