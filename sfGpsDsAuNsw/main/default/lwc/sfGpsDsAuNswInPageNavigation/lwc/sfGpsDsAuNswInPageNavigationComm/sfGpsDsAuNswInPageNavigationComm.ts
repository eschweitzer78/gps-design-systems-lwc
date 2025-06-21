/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
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
const CLASS_NAME = "sfGpsDsAuNswInPageNavigationComm";

export default 
class SfGpsDsAuNswInPageNavigationComm
extends SfGpsDsLwc {
  // @ts-ignore
  @api 
  title = "";

  // @ts-ignore
  @api 
  // @ts-ignore
  firstChild?: boolean;
  
  // @ts-ignore
  @api 
  className?: string;


  // @ts-ignore
  @api
  items?: string;
  _items = this.defineMarkdownLinksProperty("items", {
    errorCode: "IT-MD",
    errorText: "Issue when parsing Items markdown"
  });

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("nsw-scope");
  }
}
