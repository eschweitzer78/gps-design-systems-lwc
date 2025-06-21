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
import { 
  replaceInnerHtml 
} from "c/sfGpsDsHelpers";

// eslint-disable-next-line no-unused-vars
const DEBUG = false;
// eslint-disable-next-line no-unused-vars
const CLASS_NAME = "sfGpsDsAuNswCalloutComm";

export default 
class SfGpsDsAuNswCalloutComm 
extends SfGpsDsLwc {
  // @ts-ignore
  @api 
  title: string = "";

  // @ts-ignore
  @api
  level?: number;

  // @ts-ignore
  @api 
  // @ts-ignore
  firstChild?: boolean;

  // @ts-ignore
  @api 
  className?: string;

  // @ts-ignore
  @api 
  content?: string;
  _contentHtml = this.defineMarkdownContentProperty("content", {
    errorCode: "CO-MD",
    errorText: "Issue when parsing Content markdown"
  });

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("nsw-scope");
  }

  renderedCallback() {
    super.renderedCallback?.();
    /*
     * We have to add an empty span if there is a title to trigger the appropriate css for *+p and similar
     * as the react component would have one for the title in the same scope,
     * but here our containment hierarchy is a bit different.
     */

    if (this.refs.markdown) {
      const markup = (this.title ? "<span></span>" : "") + this._contentHtml.value;

      replaceInnerHtml(this.refs.markdown, markup);
    }
  }
}
