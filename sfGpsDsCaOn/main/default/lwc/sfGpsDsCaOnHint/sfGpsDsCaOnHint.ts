/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

export default class SfGpsDsCaOnHint extends SfGpsDsLwc {
  static renderMode = "light";

  // @ts-ignore
  @api
  hintId?: string;

  // @ts-ignore
  @api
  hintText?: string;

  // @ts-ignore
  @api
  className?: string;

  get computedClassName(): string {
    return `ontario-hint ${this.className || ""}`.trim();
  }

  connectedCallback(): void {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
