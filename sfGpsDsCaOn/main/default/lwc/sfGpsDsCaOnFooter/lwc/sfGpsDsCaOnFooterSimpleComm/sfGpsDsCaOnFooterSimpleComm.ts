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
const CLASS_NAME = "SfGpsDsCaOnFooterSimpleComm";

export default class SfGpsDsCaOnFooterSimpleComm extends SfGpsDsLwc {
  static renderMode = "light";

  // @ts-ignore
  @api
  footerLinksJson?: string;

  get parsedFooterLinks(): Record<string, unknown> | undefined {
    if (!this.footerLinksJson) return undefined;
    
    try {
      return JSON.parse(this.footerLinksJson);
    } catch (e) {
      this.addError("FL-JP", "Footer links JSON is invalid");
      return undefined;
    }
  }

  // @ts-ignore
  @api
  topMargin?: boolean;

  // @ts-ignore
  @api
  language?: string;

  // @ts-ignore
  @api
  assetBasePath?: string;

  // @ts-ignore
  @api
  className?: string;

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
