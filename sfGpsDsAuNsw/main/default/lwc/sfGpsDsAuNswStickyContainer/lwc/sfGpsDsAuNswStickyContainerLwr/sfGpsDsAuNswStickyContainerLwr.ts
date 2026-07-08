/*
 * Copyright (c) 2023-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

/**
 * @slot StickyContent
 */
export default 
class SfGpsDsAuNswStickyContainerLwr
extends SfGpsDsLwc {
  static renderMode: "light" | "shadow" = "light";

  // @ts-ignore
  @api
  className?: string;

  constructor() {
    super(true);
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("nsw-scope");
  }
}