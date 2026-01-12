/*
 * Copyright (c) 2026, Emmanuel Schweitzer, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api 
} from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

// eslint-disable-next-line no-unused-vars
const DEBUG = false;
// eslint-disable-next-line no-unused-vars
const CLASS_NAME = "SfGpsDsCaOnBadgeComm";

export default 
class SfGpsDsCaOnBadgeComm 
extends SfGpsDsLwc {
  // @ts-ignore
  @api 
  label?: string;

  // @ts-ignore
  @api 
  ariaLabelText?: string;

  // @ts-ignore
  @api 
  colour?: string;

  // @ts-ignore
  @api 
  className?: string;

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("onca-scope");
  }
}
