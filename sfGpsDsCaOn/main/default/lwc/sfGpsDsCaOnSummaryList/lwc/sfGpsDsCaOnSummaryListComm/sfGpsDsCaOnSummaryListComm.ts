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
const CLASS_NAME = "SfGpsDsCaOnSummaryListComm";

export default class SfGpsDsCaOnSummaryListComm extends SfGpsDsLwc {
  static renderMode = "light";

  // @ts-ignore
  @api
  heading?: string;

  // @ts-ignore
  @api
  headingActionLabel?: string;

  // @ts-ignore
  @api
  headingActionUrl?: string;

  // @ts-ignore
  @api
  itemsJson?: string;

  // @ts-ignore
  @api
  ratio?: string;

  // @ts-ignore
  @api
  fullWidth?: boolean;

  // @ts-ignore
  @api
  compact?: boolean;

  // @ts-ignore
  @api
  className?: string;

  get parsedItems(): unknown[] | undefined {
    if (!this.itemsJson) return undefined;

    try {
      const parsed = JSON.parse(this.itemsJson);
      return Array.isArray(parsed) ? parsed : undefined;
    } catch (e) {
      this.addError("IT-JP", "Summary list items JSON is invalid");
      return undefined;
    }
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
