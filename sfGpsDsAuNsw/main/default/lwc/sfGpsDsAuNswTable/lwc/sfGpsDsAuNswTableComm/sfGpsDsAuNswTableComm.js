/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import { isArray, isString, isObject } from "c/sfGpsDsHelpers";
import SfGpsDsIpLwc from "c/sfGpsDsIpLwc";

export default class extends SfGpsDsIpLwc {
  @api resultsBarStyle = "full";
  @api caption;
  @api captionLocation;
  @api isStriped = false;
  @api isBordered = false;
  @api pageSize = 20;
  @api className;

  /* api: ipName, String */

  @api
  get ipName() {
    return super.ipName;
  }

  set ipName(value) {
    super.ipName = value;
  }

  /* api: inputJSON, String */

  @api
  get inputJSON() {
    return super.inputJSON;
  }

  set inputJSON(value) {
    super.inputJSON = value;
  }

  /* api: optionsJSON, String */

  @api
  get optionsJSON() {
    return super.optionsJSON;
  }

  set optionsJSON(value) {
    super.optionsJSON = value;
  }

  /* api: sortOrder, String */

  _sortHeader;

  @api
  get sortHeader() {
    return this._sortHeader;
  }

  set sortHeader(value) {
    this._sortHeader = value;
    this.computeSortOptions();
  }

  /* api: headers, String */

  _headersOriginal;
  _headers;

  @api
  get headers() {
    return this._headersOriginal;
  }

  set headers(value) {
    this._headersOriginal = value;

    if (!isString(value)) {
      this._headers = [];
      return;
    }

    let headerArray = value.split(";");
    let headers = [];

    for (let i = 0; i < headerArray.length; i++) {
      let headerParts = headerArray[i].split(":");

      headers.push({
        name: headerParts[0],
        label: headerParts[1],
        width: headerParts[2]
      });
    }

    this._headers = headers;
    this.computeSortOptions();
  }

  _totalRows;
  _activePage;
  _lastPage;
  _offset;
  _content;
  _sortOptions;

  /* computed */

  get computedFrom() {
    return (this._offset || 0) + 1;
  }

  get computedTo() {
    return Math.min(
      (this._offset || 0) + (this.pageSize || this._totalRows),
      this._totalRows
    );
  }

  get computedVisibleSortOptions() {
    return this.resultsBarStyle === "full" ? this._sortOptions : null;
  }

  get computedShowResultsBar() {
    return this.resultsBarStyle !== "none";
  }

  /* methods */

  computeSortOptions() {
    if (this._headers == null) {
      this._sortOptions = null;
      return;
    }

    if (this._sortHeader == null) {
      this._sortHeader = this._headers[0].name;
    }

    this._sortOptions = this._headers
      ? this._headers.map((header) => ({
          label: header.label,
          value: header.name,
          selected: header.name === this._sortHeader
        }))
      : null;

    this.sortContent();
  }

  mapIpData(data) {
    this._content = isArray(data) ? data : [data];
    this._totalRows = this._content.length;
    this._lastPage = this.pageSize
      ? Math.ceil(this._totalRows / this.pageSize)
      : 1;
    this.sortContent();
  }

  handlePageChange(event) {
    this._activePage = event.detail;
    this._offset = this.pageSize ? (this._activePage - 1) * this.pageSize : 0;
  }

  handleSortChange(event) {
    this._sortHeader = event.detail;
    this.sortContent();
  }

  sortContent(sortHeader = this._sortHeader) {
    if (this._content && sortHeader) {
      let content = [...this._content];
      this._content = content.sort((rowA, rowB) => {
        const cA = rowA[sortHeader],
          cB = rowB[sortHeader];
        const vA = isObject(cA) ? cA.value : cA;
        const vB = isObject(cB) ? cB.value : cB;

        if (vA == null) return 1;
        if (vB == null) return -1;

        return vA > vB ? 1 : vA < vB ? -1 : 0;
      });
    }

    this._activePage = 1;
    this._offset = 0;
  }
}
