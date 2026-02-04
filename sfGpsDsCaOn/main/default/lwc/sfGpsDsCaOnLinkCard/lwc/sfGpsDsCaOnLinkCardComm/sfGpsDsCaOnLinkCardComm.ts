/*
 * Copyright (c) 2026, Shannon Schupbach, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

/**
 * Experience Builder wrapper for Ontario DS Link Card.
 */
export default 
class SfGpsDsCaOnLinkCardComm 
extends SfGpsDsLwc {
  // @ts-ignore
  @api
  heading?: string;

  // @ts-ignore
  @api
  description?: string;

  // @ts-ignore
  @api
  url?: string;

  // @ts-ignore
  @api
  isExternal?: boolean;

  // @ts-ignore
  @api
  headingLevel?: string;

  // @ts-ignore
  @api
  className?: string;

  /* Lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
