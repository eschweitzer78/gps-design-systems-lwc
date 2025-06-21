/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api 
} from "lwc";
import { 
  isArray, 
  isString, 
  isObject 
} from "c/sfGpsDsHelpers";
import SfGpsDsIpLwc from "c/sfGpsDsIpLwc";

import type { 
  CaptionLocation, 
  Header 
} from "c/sfGpsDsAuNswTable";

interface SortOption {
  label: string,
  value: string,
  selected?: boolean
}

export default 
class SfGpsDsNswTableComm 
extends SfGpsDsIpLwc {
  // @ts-ignore
  @api 
  resultsBarStyle: string = "full";

  // @ts-ignore
  @api 
  caption?: string;

  // @ts-ignore
  @api 
  captionLocation?: CaptionLocation;

  // @ts-ignore
  @api 
  isStriped: boolean = false;

  // @ts-ignore
  @api 
  isBordered: boolean = false;

  // @ts-ignore
  @api 
  pageSize: number = 20;

  // @ts-ignore
  @api 
  className?: string;

  /* api: ipName, String */

  // @ts-ignore
  @api
  // @ts-ignore
  get ipName() {
    // @ts-ignore
    return super.ipName;
  }

  set ipName(value) {
    // @ts-ignore
    super.ipName = value;
  }

  /* api: inputJSON, String */

  // @ts-ignore
  @api
  // @ts-ignore
  get inputJSON() {
    // @ts-ignore
    return super.inputJSON;
  }

  set inputJSON(value) {
    // @ts-ignore
    super.inputJSON = value;
  }

  /* api: optionsJSON, String */

  // @ts-ignore
  @api
  // @ts-ignore
  get optionsJSON() {
    // @ts-ignore
    return super.optionsJSON;
  }

  set optionsJSON(value) {
    // @ts-ignore
    super.optionsJSON = value;
  }

  /* api: sortOrder, String */

  _sortHeader?: string;

  // @ts-ignore
  @api
  get sortHeader(): string | undefined {
    return this._sortHeader;
  }

  set sortHeader(value: string) {
    this._sortHeader = value;
    this.computeSortOptions();
  }

  /* api: headers, String */

  _headersOriginal?: string;
  _headers?: Header[];

  // @ts-ignore
  @api
  get headers(): string | undefined {
    return this._headersOriginal;
  }

  set headers(value: string) {
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

  _totalRows: number = 0;
  _activePage: number = 0;
  _lastPage: number = 0;
  _offset: number = 0;
  _content?: object[];
  _sortOptions?: SortOption[];

  /* computed */

  get computedFrom(): number {
    return (this._offset || 0) + 1;
  }

  get computedTo(): number {
    return Math.min(
      (this._offset || 0) + (this.pageSize || this._totalRows),
      this._totalRows
    );
  }

  get computedVisibleSortOptions(): SortOption[] | undefined {
    return this.resultsBarStyle === "full" 
      ? this._sortOptions 
      : undefined;
  }

  get computedShowResultsBar(): boolean {
    return this.resultsBarStyle !== "none";
  }

  /* methods */

  computeSortOptions(): void {
    if (this._headers == undefined) {
      this._sortOptions = undefined;
      return;
    }

    if (this._sortHeader == undefined) {
      this._sortHeader = this._headers[0].name;
    }

    this._sortOptions = this._headers
      ? this._headers.map((header) => ({
          label: header.label,
          value: header.name,
          selected: header.name === this._sortHeader
        }))
      : undefined;

    this.sortContent();
  }

  mapIpData(
    data: object | object[]
  ): any {
    this._content = isArray(data) 
      ? data as object[] 
      : [data as object];
    this._totalRows = this._content.length;
    this._lastPage = this.pageSize
      ? Math.ceil(this._totalRows / this.pageSize)
      : 1;
    this.sortContent();
  }

  sortContent(
    sortHeader: string | undefined = this._sortHeader
  ): void {
    if (this._content && sortHeader) {
      let content = [...this._content];
      this._content = content.sort((rowA, rowB) => {
        // @ts-ignore
        const cA = rowA[sortHeader];
        // @ts-ignore
        const cB = rowB[sortHeader];

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

  /* event management */

  handlePageChange(
    event: CustomEvent
  ): void {
    this._activePage = event.detail;
    this._offset = this.pageSize ? (this._activePage - 1) * this.pageSize : 0;
  }

  handleSortChange(
    event: CustomEvent
  ): void {
    this._sortHeader = event.detail;
    this.sortContent();
  }
}
