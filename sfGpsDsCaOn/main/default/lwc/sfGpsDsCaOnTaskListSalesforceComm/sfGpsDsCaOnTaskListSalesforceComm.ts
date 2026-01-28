/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

// eslint-disable-next-line no-unused-vars
const DEBUG = false;
// eslint-disable-next-line no-unused-vars
const CLASS_NAME = "SfGpsDsCaOnTaskListSalesforceComm";

export default class SfGpsDsCaOnTaskListSalesforceComm extends SfGpsDsLwc {
  static renderMode = "light";

  // @ts-ignore
  @api
  recordId?: string;

  // @ts-ignore
  @api
  showCompleted?: boolean;

  // @ts-ignore
  @api
  maxRecords?: number;

  // @ts-ignore
  @api
  emptyMessage?: string;

  // @ts-ignore
  @api
  className?: string;

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
