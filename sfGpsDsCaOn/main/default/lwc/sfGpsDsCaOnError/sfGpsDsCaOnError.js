/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
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
  errorId;
  // @ts-ignore
  @api
  message;
  // @ts-ignore
  @api
  isHidden;
  // @ts-ignore
  @api
  className;
  get computedClassName() {
    let classes = "ontario-error-messaging";
    if (this.isHidden) classes += " ontario-error__hidden";
    if (this.className) classes += ` ${this.className}`;
    return classes;
  }
  get showError() {
    return !!this.message && !this.isHidden;
  }
  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
