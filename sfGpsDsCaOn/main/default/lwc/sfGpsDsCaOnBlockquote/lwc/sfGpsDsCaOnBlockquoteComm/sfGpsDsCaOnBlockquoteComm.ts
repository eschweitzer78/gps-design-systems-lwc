/*
 * Copyright (c) 2025, Emmanuel Schweitzer, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api 
} from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { 
  replaceInnerHtml 
} from "c/sfGpsDsHelpers";

// eslint-disable-next-line no-unused-vars
const DEBUG = false;
// eslint-disable-next-line no-unused-vars
const CLASS_NAME = "SfGpsDsCaOnQuoteComm";

export default 
class SfGpsDsCaOnQuoteComm 
extends SfGpsDsLwc {
  // @ts-ignore
  @api 
  attribution?: string;

  // @ts-ignore
  @api
  byline?: string;

  // @ts-ignore
  @api 
  className?: string;

  // @ts-ignore
  @api 
  quote?: string;
  _quoteHtml = this.defineMarkdownContentProperty("quote", {
    errorCode: "QU-MD",
    errorText: "Issue when parsing Quote markdown"
  });

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }

  renderedCallback() {
    super.renderedCallback?.();

    if (this.refs.markdown) {
      replaceInnerHtml(this.refs.markdown, this._quoteHtml.value);
    }
  }
}
