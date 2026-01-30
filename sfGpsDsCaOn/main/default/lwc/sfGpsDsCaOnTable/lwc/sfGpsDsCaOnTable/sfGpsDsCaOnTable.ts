/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

// eslint-disable-next-line no-unused-vars
const DEBUG = false;
// eslint-disable-next-line no-unused-vars
const CLASS_NAME = "SfGpsDsCaOnTable";

export interface TableColumn {
  label: string;
  key: string;
  isNumeric?: boolean;
  columnSpan?: number;
}

export interface TableRow {
  [key: string]: unknown;
  isHighlight?: boolean;
  isSubtotal?: boolean;
}

export interface TableFooterRow {
  [key: string]: unknown;
}

export default class SfGpsDsCaOnTable extends SfGpsDsLwc {
  static renderMode = "light";

  // @ts-ignore
  @api
  caption?: string;

  // @ts-ignore
  @api
  columns?: TableColumn[] | string;

  // @ts-ignore
  @api
  rows?: TableRow[] | string;

  // @ts-ignore
  @api
  footerRow?: TableFooterRow | string;

  // @ts-ignore
  @api
  condensed?: boolean;
  _condensed = this.defineBooleanProperty("condensed", {
    defaultValue: false
  });

  // @ts-ignore
  @api
  noZebraStripes?: boolean;
  _noZebraStripes = this.defineBooleanProperty("noZebraStripes", {
    defaultValue: false
  });

  // @ts-ignore
  @api
  fullWidth?: boolean;
  _fullWidth = this.defineBooleanProperty("fullWidth", {
    defaultValue: false
  });

  // @ts-ignore
  @api
  className?: string;

  /**
   * AODA: Accessible label for the table when no caption is provided.
   * If caption is set, it takes precedence.
   */
  // @ts-ignore
  @api
  tableAriaLabel?: string;

  /* getters */

  /**
   * Returns the aria-label for the table.
   * AODA/WCAG 1.3.1: Tables must have an accessible name.
   * Uses caption if provided, otherwise falls back to tableAriaLabel.
   * @returns {string|null} Aria label for the table
   */
  get computedAriaLabel(): string | null {
    // If caption is provided, it serves as the accessible name
    if (this.caption) {
      return null;
    }
    // Use explicit tableAriaLabel if provided
    if (this.tableAriaLabel) {
      return this.tableAriaLabel;
    }
    // Default fallback
    return "Data table";
  }

  get computedColumns(): Array<TableColumn & { id: string; headerClassName: string }> {
    if (!this.columns) return [];

    let parsedColumns: TableColumn[];
    if (typeof this.columns === "string") {
      try {
        parsedColumns = JSON.parse(this.columns);
      } catch {
        return [];
      }
    } else {
      parsedColumns = this.columns;
    }

    return parsedColumns.map((col, index) => ({
      ...col,
      id: `col-${index}`,
      headerClassName: this.getHeaderClassName(col)
    }));
  }

  get computedRows(): Array<{ id: string; rowClassName: string; cells: Array<{ id: string; value: unknown; cellClassName: string; isRowHeader: boolean }> }> {
    if (!this.rows || !this.columns) return [];

    let parsedRows: TableRow[];
    if (typeof this.rows === "string") {
      try {
        parsedRows = JSON.parse(this.rows);
      } catch {
        return [];
      }
    } else {
      parsedRows = this.rows;
    }

    const cols = this.computedColumns;

    return parsedRows.map((row, rowIndex) => ({
      id: `row-${rowIndex}`,
      rowClassName: this.getRowClassName(row),
      cells: cols.map((col, colIndex) => ({
        id: `cell-${rowIndex}-${colIndex}`,
        value: row[col.key],
        cellClassName: col.isNumeric ? "ontario-table-cell--numeric" : "",
        isRowHeader: colIndex === 0
      }))
    }));
  }

  get hasFooter(): boolean {
    return Boolean(this.footerRow);
  }

  get computedFooterCells(): Array<{ id: string; value: unknown; cellClassName: string; isRowHeader: boolean }> {
    if (!this.footerRow || !this.columns) return [];

    let parsedFooter: TableFooterRow;
    if (typeof this.footerRow === "string") {
      try {
        parsedFooter = JSON.parse(this.footerRow);
      } catch {
        return [];
      }
    } else {
      parsedFooter = this.footerRow;
    }

    const cols = this.computedColumns;

    return cols.map((col, colIndex) => ({
      id: `footer-cell-${colIndex}`,
      value: parsedFooter[col.key],
      cellClassName: col.isNumeric ? "ontario-table-cell--numeric" : "",
      isRowHeader: colIndex === 0
    }));
  }

  get computedTableClassName(): string {
    const classes: string[] = [];
    if (this._condensed.value) {
      classes.push("ontario-table--condensed");
    }
    if (this._noZebraStripes.value) {
      classes.push("ontario-table--no-zebra-stripes");
    }
    if (this._fullWidth.value) {
      classes.push("ontario-table--full-container-width");
    }
    return classes.join(" ");
  }

  get computedContainerClassName(): string {
    const classes = ["ontario-table-container"];
    if (this.className) {
      classes.push(this.className);
    }
    return classes.join(" ");
  }

  private getHeaderClassName(col: TableColumn): string {
    const classes: string[] = [];
    if (col.isNumeric) {
      classes.push("ontario-table-cell--numeric");
    }
    if (col.columnSpan) {
      classes.push(`ontario-table-header--column-span-${col.columnSpan}`);
    }
    return classes.join(" ");
  }

  private getRowClassName(row: TableRow): string {
    const classes: string[] = [];
    if (row.isHighlight) {
      classes.push("ontario-table-row--highlight");
    }
    if (row.isSubtotal) {
      classes.push("ontario-table-row--subtotal");
    }
    return classes.join(" ");
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
