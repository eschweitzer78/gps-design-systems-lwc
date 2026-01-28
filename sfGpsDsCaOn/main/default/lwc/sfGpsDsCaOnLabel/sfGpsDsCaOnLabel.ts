/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

export default class SfGpsDsCaOnLabel extends SfGpsDsLwc {
  static renderMode = "light";

  // @ts-ignore
  @api
  label?: string;

  // @ts-ignore
  @api
  forId?: string;

  // @ts-ignore
  @api
  required?: boolean;

  // @ts-ignore
  @api
  optional?: boolean;

  // @ts-ignore
  @api
  large?: boolean;

  // @ts-ignore
  @api
  heading?: boolean;

  // @ts-ignore
  @api
  className?: string;

  get computedClassName(): string {
    let classes = "ontario-label";
    if (this.large) classes += " ontario-label--large";
    if (this.heading) classes += " ontario-label--heading";
    if (this.className) classes += ` ${this.className}`;
    return classes;
  }

  get showFlag(): boolean {
    return this.required === true || this.optional === true;
  }

  get flagText(): string {
    if (this.required) return "required";
    if (this.optional) return "optional";
    return "";
  }

  connectedCallback(): void {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
