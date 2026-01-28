/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

export default class SfGpsDsCaOnFieldset extends SfGpsDsLwc {
  static renderMode = "light";

  // @ts-ignore
  @api legend?: string;
  // @ts-ignore
  @api legendLarge?: boolean;
  // @ts-ignore
  @api legendHeading?: boolean;
  // @ts-ignore
  @api hintText?: string;
  // @ts-ignore
  @api required?: boolean;
  // @ts-ignore
  @api optional?: boolean;
  // @ts-ignore
  @api className?: string;

  _hintId = `hint-${Math.random().toString(36).substring(2, 11)}`;

  get computedFieldsetClassName(): string {
    let classes = "ontario-fieldset";
    if (this.className) classes += ` ${this.className}`;
    return classes;
  }

  get computedLegendClassName(): string {
    let classes = "ontario-fieldset__legend";
    if (this.legendLarge) classes += " ontario-fieldset__legend--large";
    if (this.legendHeading) classes += " ontario-fieldset__legend--heading";
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

  /* Lifecycle */

  connectedCallback(): void {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
