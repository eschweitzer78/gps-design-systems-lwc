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
const CLASS_NAME = "sfGpsDsAuNswLinkListComm";

export default
class SfGpsDsAuNswLinkListComm 
extends SfGpsDsLwc {
  // @ts-ignore
  @api 
  title = "";

  // @ts-ignore
  @api 
  highlightExternal?: boolean;

  // @ts-ignore
  @api 
  firstChild?: boolean;
  
  // @ts-ignore
  @api 
  className?: string;

  // @ts-ignore
  @api
  links?: string;
  _links = this.defineMarkdownLinksProperty("links", {
    errorCode: "IT-MD",
    errorText: "Issue when parsing Links markdown"
  });

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("nsw-scope");
  }
}
