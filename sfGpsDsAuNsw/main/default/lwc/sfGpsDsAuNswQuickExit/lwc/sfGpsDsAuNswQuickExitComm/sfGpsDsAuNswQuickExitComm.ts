/*
 * Copyright (c) 2022-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";

export default 
class SfGpsDsAuNswQuickExitComm 
extends SfGpsDsLwc {
  // @ts-ignore
  @api
  safeUrl?: string;

  // @ts-ignore
  @api 
  copy?: string;
  _copyHtml = this.defineMarkdownContentProperty("copy", {
    errorCode: "CO-MD",
    errorText: "Issue when parsing Copy markdown"
  });

  // @ts-ignore
  @api
  enableEsc?: boolean;

  // @ts-ignore
  @api
  enableCloak?: boolean;

  // @ts-ignore
  @api
  focusFirst?: boolean;
  
  // @ts-ignore
  @api 
  className?: string;

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("nsw-scope");
  }
  
  renderedCallback() {
    super.renderedCallback?.();

    if (this.refs.copy) {
      replaceInnerHtml(this.refs.copy, this._copyHtml.value ?? "");
    }
  }
}