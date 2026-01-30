/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

export default class SfGpsDsCaOnFieldsetComm extends SfGpsDsLwc {
  static renderMode = "light";

  // @ts-ignore
  @api
  legend?: string;

  // @ts-ignore
  @api
  legendLarge?: boolean;

  // @ts-ignore
  @api
  legendHeading?: boolean;

  // @ts-ignore
  @api
  hintText?: string;

  // @ts-ignore
  @api
  required?: boolean;

  // @ts-ignore
  @api
  optional?: boolean;

  // @ts-ignore
  @api
  className?: string;

  /* Lifecycle */

  connectedCallback(): void {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
