/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

// eslint-disable-next-line no-unused-vars
const DEBUG = false;
// eslint-disable-next-line no-unused-vars
const CLASS_NAME = "SfGpsDsCaOnDateInputComm";

export default class SfGpsDsCaOnDateInputComm extends SfGpsDsLwc {
  static renderMode = "light";

  // @ts-ignore
  @api label?: string;

  // @ts-ignore
  @api name?: string;

  // @ts-ignore
  @api hintText?: string;

  // @ts-ignore
  @api value?: string;

  // @ts-ignore
  @api required?: boolean;

  // @ts-ignore
  @api optional?: boolean;

  // @ts-ignore
  @api disabled?: boolean;

  // @ts-ignore
  @api minDate?: string;

  // @ts-ignore
  @api maxDate?: string;

  // @ts-ignore
  @api errorMessage?: string;

  // @ts-ignore
  @api dayLabel?: string;

  // @ts-ignore
  @api monthLabel?: string;

  // @ts-ignore
  @api yearLabel?: string;

  // @ts-ignore
  @api className?: string;

  /* Lifecycle */

  connectedCallback(): void {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
