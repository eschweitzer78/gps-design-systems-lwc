/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

export default class SfGpsDsCaOnError extends SfGpsDsLwc {
  static renderMode = "light";

  // @ts-ignore
  @api
  errorId?: string;

  // @ts-ignore
  @api
  message?: string;

  // @ts-ignore
  @api
  isHidden?: boolean;

  // @ts-ignore
  @api
  className?: string;

  get computedClassName(): string {
    let classes = "ontario-error-messaging";
    if (this.isHidden) classes += " ontario-error__hidden";
    if (this.className) classes += ` ${this.className}`;
    return classes;
  }

  get showError(): boolean {
    return !!this.message && !this.isHidden;
  }

  connectedCallback(): void {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
