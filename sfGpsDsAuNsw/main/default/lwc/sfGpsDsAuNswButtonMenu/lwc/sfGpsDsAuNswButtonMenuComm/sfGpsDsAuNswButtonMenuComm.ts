/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
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
const CLASS_NAME = "sfGpsDsAuNswButtonMenuComm";

export default
class SfGpsDsAuNswButtonMenuComm 
extends SfGpsDsLwc {
  // @ts-ignore
  @api 
  label?: string;

  // @ts-ignore
  @api 
  iconName?: string;

  // @ts-ignore
  @api 
  variant?: string;

  // @ts-ignore
  @api 
  menuPosition?: string;

  // @ts-ignore
  @api
  links?: string;
  _links = this.defineMarkdownLinksProperty("links", {
    errorCode: "IT-MD",
    errorText: "Issue when parsing Links markdown"
  });

  // @ts-ignore
  @api 
  className?: string;

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("nsw-scope");
  }
}
