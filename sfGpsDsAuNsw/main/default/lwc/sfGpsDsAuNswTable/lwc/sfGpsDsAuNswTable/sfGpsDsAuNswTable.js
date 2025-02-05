/*
 * Copyright (c) 2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";
import { isArray, normaliseBoolean, normaliseString } from "c/sfGpsDsHelpers";

const CAPTIONLOCATION_TOP = "top";
const CAPTIONLOCATION_BOTTOM = "bottom";
const CAPTIONLOCATION_NONE = "none";
const CAPTIONLOCATION_VALUES = [
  CAPTIONLOCATION_BOTTOM,
  CAPTIONLOCATION_NONE,
  CAPTIONLOCATION_TOP
];
const CAPTIONLOCATION_DEFAULT = CAPTIONLOCATION_BOTTOM;

const ISSTRIPED_DEFAULT = false;
const ISBORDERED_DEFAULT = false;

export default class extends LightningElement {
  @api caption;
  @api offset;
  @api limit;
  @api className;

  /* api: captionLocation, Picklist */

  _captionLocation = CAPTIONLOCATION_DEFAULT;
  _captionLocationOriginal = CAPTIONLOCATION_DEFAULT;

  @api
  get captionLocation() {
    return this._captionLocationOriginal;
  }

  set captionLocation(value) {
    this._captionLocationOriginal = value;
    this._captionLocation = normaliseString(value, {
      validValues: CAPTIONLOCATION_VALUES,
      fallbackValue: CAPTIONLOCATION_DEFAULT
    });
  }
  /* api: isStriped, Boolean */

  _isStriped = ISSTRIPED_DEFAULT;
  _isStripedOriginal = ISSTRIPED_DEFAULT;

  @api
  get isStriped() {
    return this._isStripedOriginal;
  }

  set isStriped(value) {
    this._isStripedOriginal = value;
    this._isStriped = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: ISSTRIPED_DEFAULT
    });
  }

  /* api: isBordered, Boolean */

  _isBordered = ISBORDERED_DEFAULT;
  _isBorderedOriginal = ISBORDERED_DEFAULT;

  @api
  get isBordered() {
    return this._isBorderedOriginal;
  }

  set isBordered(value) {
    this._isBorderedOriginal = value;
    this._isBordered = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: ISBORDERED_DEFAULT
    });
  }

  /* api: content, Array of Objects */

  _content;
  _contentOriginal;
  _attributes = new Set();

  @api
  get content() {
    return this._contentOriginal;
  }

  set content(value) {
    this._contentOriginal = value;
    this._attributes = new Set();

    if (value == null) {
      value = [];
    } else if (!isArray(value)) {
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

  /* api: headers, Array of Objects */

  _headers;
  _headersOriginal;

  @api
  get headers() {
    return this._headersOriginal;
  }

  set headers(value) {
    this._headersOriginal = value;

    if (!isArray(value)) {
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
    return {
      "nsw-table": true,
      "nsw-table--striped": this._isStriped,
      "nsw-table--bordered": this.isBordered,
      "nsw-table--caption-top": this._captionLocation === CAPTIONLOCATION_TOP,
      [this.className]: this.className
    };
  }

  get computedShowCaption() {
    return this._captionLocation !== CAPTIONLOCATION_NONE;
  }
}
