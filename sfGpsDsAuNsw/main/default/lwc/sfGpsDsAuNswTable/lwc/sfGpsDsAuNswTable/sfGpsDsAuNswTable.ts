/*
 * Copyright (c) 2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api 
} from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
import { 
  isArray, 
  isObject 
} from "c/sfGpsDsHelpers";

import type { 
  CaptionLocation,
  ContentItemObject,
  ContentItem,
  ContentRow,
  Content,
  TableRow,
  DisplayRow,
  Header,
  ContentDisplayType,
  ContentItemLiteral
} from "c/sfGpsDsAuNswTable";

const CAPTIONLOCATION_TOP: CaptionLocation = "top";
const CAPTIONLOCATION_BOTTOM: CaptionLocation = "bottom";
const CAPTIONLOCATION_NONE: CaptionLocation = "none";
const CAPTIONLOCATION_VALUES: CaptionLocation[] = [
  CAPTIONLOCATION_BOTTOM,
  CAPTIONLOCATION_NONE,
  CAPTIONLOCATION_TOP
];
const CAPTIONLOCATION_DEFAULT = CAPTIONLOCATION_BOTTOM;

const ISSTRIPED_DEFAULT = false;
const ISBORDERED_DEFAULT = false;

export default 
class SfGpsDsAuNswTable
extends SfGpsDsElement {
  // @ts-ignore
  @api 
  caption?: string;

  // @ts-ignore
  @api 
  className?: string;

  // @ts-ignore
  @api 
  offset?: number;
  _offset = this.defineIntegerProperty("offset", {
    minValue: 0,
    defaultValue: 0
  });

  // @ts-ignore
  @api 
  limit?: number;
  _limit = this.defineIntegerProperty("limit", {
    minValue: 1,
    defaultValue: null
  });

  // @ts-ignore
  @api 
  captionLocation?: CaptionLocation;
  _captionLocation = this.defineEnumProperty<CaptionLocation>("captionLocation", {
    validValues: CAPTIONLOCATION_VALUES,
    defaultValue: CAPTIONLOCATION_DEFAULT
  });

  // @ts-ignore
  @api 
  isStriped?: boolean;
  _isStriped = this.defineBooleanProperty("isStriped", {
    defaultValue: ISSTRIPED_DEFAULT
  });

  // @ts-ignore
  @api 
  isBordered?: boolean;
  _isBordered = this.defineBooleanProperty("isBordered", {
    defaultValue: ISBORDERED_DEFAULT
  });

  /* api: content, Array of Objects */

  _content?: TableRow[];
  _contentOriginal?: Content | ContentRow;
  _attributes = new Set<string>();

  // @ts-ignore
  @api
  get content(): Content | ContentRow | undefined {
    return this._contentOriginal;
  }

  set content(value: Content | ContentRow) {
    this._contentOriginal = value;
    this._attributes = new Set<string>();

    if (value == null) {
      value = [];
    } else if (!isArray(value)) {
      value = [value as ContentRow];
    }

    this._content = 
      (value as Content)
      .map((row: ContentRow, rowIndex: number) => {
        let nRow: TableRow = {
          _key: `row-${rowIndex + 1}`,
          _items: {}
        };

        for (let colName in row) {
          if (Object.hasOwn(row, colName)) {
            if (!colName.startsWith("_")) {
              let col: ContentItem = row[colName];
              this._attributes.add(colName);

              if (col !== null && isObject(col)) {
                const cio = col as ContentItemObject;
                const cioType = cio.type;
                nRow._items[colName] = {
                  ...cio,
                  _key: colName,
                  _isMarkdown: cioType === "markdown",
                  _isString: cioType === "string",
                  _isNumber: cioType === "number",
                  _isBoolean: cioType === "boolean",
                  _isReference: cioType === "reference"
                };
              } else if ([
                "string", 
                "number", 
                "boolean"
              ].includes(typeof col)) {
                const type: ContentDisplayType = col != null 
                  ? typeof col as ContentDisplayType
                  : "string";

                nRow._items[colName] = {
                  value: col as ContentItemLiteral,
                  type: type,
                  _key: colName,
                  _isMarkdown: false,
                  _isString: type === "string",
                  _isNumber: type === "number",
                  _isBoolean: type === "boolean",
                  _isReference: false
                };
              }
            }
          }
        }

        return nRow;
      });
  }

  /* api: headers, Array of Objects */

  _headers?: Header[];
  _headersOriginal?: Header[] | Header;

  // @ts-ignore
  @api
  get headers(): Header[] | Header | undefined {
    return this._headersOriginal;
  }

  set headers(value: Header[] | Header) {
    this._headersOriginal = value;

    if (!isArray(value) ) {
      value = [value as Header];
    }

    this._headers = value as Header[];
  }

  /* computed */

  get _tableHeaders(): Header[] {
    return (
      this._headers ||
      Array.from(this._attributes.keys()).map((attr) => ({
        name: attr,
        label: attr
      }))
    );
  }

  get _tableRows(): DisplayRow[] | undefined {
    if (this._content == null) {
      return undefined;
    }

    const headers = this._tableHeaders;
    const offset = this._offset.value || 0;
    const limit = this._limit.value || this._content.length || 0;

    const content = this._content.slice(offset, offset + limit);

    return content.map((row: TableRow, index: number) => ({
      _key: `row-${index + 1}`,
      _cols: headers.map((header) => row._items[header.name] || { 
        _key: `col-empty-${index + 1}-${header.name}`
      })
    }));
  }

  get computedClassName(): any {
    return {
      "nsw-table": true,
      "nsw-table--striped": this._isStriped.value,
      "nsw-table--bordered": this._isBordered.value,
      "nsw-table--caption-top": this._captionLocation.value === CAPTIONLOCATION_TOP,
      [this.className || ""]: !!this.className
    };
  }

  get computedShowCaption(): boolean {
    return this._captionLocation.value !== CAPTIONLOCATION_NONE;
  }
}
