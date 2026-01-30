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
const CLASS_NAME = "SfGpsDsCaOnTableComm";

export default class SfGpsDsCaOnTableComm extends SfGpsDsLwc {
  static renderMode = "light";

  // @ts-ignore
  @api
  caption?: string;

  // @ts-ignore
  @api
  columnsJson?: string;

  // @ts-ignore
  @api
  rowsJson?: string;

  // @ts-ignore
  @api
  footerRowJson?: string;

  // @ts-ignore
  @api
  condensed?: boolean;

  // @ts-ignore
  @api
  noZebraStripes?: boolean;

  // @ts-ignore
  @api
  fullWidth?: boolean;

  // @ts-ignore
  @api
  className?: string;

  get parsedColumns(): unknown[] | undefined {
    if (!this.columnsJson) return undefined;

    try {
      const parsed = JSON.parse(this.columnsJson);
      return Array.isArray(parsed) ? parsed : undefined;
    } catch (e) {
      this.addError("CO-JP", "Table columns JSON is invalid");
      return undefined;
    }
  }

  get parsedRows(): unknown[] | undefined {
    if (!this.rowsJson) return undefined;

    try {
      const parsed = JSON.parse(this.rowsJson);
      return Array.isArray(parsed) ? parsed : undefined;
    } catch (e) {
      this.addError("RO-JP", "Table rows JSON is invalid");
      return undefined;
    }
  }

  get parsedFooterRow(): unknown | undefined {
    if (!this.footerRowJson) return undefined;

    try {
      return JSON.parse(this.footerRowJson);
    } catch (e) {
      this.addError("FO-JP", "Table footer row JSON is invalid");
      return undefined;
    }
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
