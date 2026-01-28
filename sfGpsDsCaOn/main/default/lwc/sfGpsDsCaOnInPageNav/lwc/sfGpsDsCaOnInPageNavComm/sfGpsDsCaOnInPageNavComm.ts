/*
 * Copyright (c) 2025, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

// eslint-disable-next-line no-unused-vars
const DEBUG = false;
// eslint-disable-next-line no-unused-vars
const CLASS_NAME = "SfGpsDsCaOnInPageNavComm";

export default class SfGpsDsCaOnInPageNavComm extends SfGpsDsLwc {
  static renderMode = "light";

  // @ts-ignore
  @api
  heading?: string;

  // @ts-ignore
  @api
  itemsJson?: string;

  get parsedItems(): unknown[] | undefined {
    if (!this.itemsJson) return undefined;
    
    try {
      const parsed = JSON.parse(this.itemsJson);
      return Array.isArray(parsed) ? parsed : undefined;
    } catch (e) {
      this.addError("IT-JP", "Navigation items JSON is invalid");
      return undefined;
    }
  }

  // @ts-ignore
  @api
  showTopBorder?: boolean;

  // @ts-ignore
  @api
  skipLinkId?: string;

  // @ts-ignore
  @api
  className?: string;

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
