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

import type {
  CStyle
} from "c/sfGpsDsAuNswMasthead";

const MASTHEADLABEL_DEFAULT = "A NSW Government website";

export default
class SfGpsDsAuNswMastheadComm
extends SfGpsDsLwc {
  // @ts-ignore
  @api 
  arLabel: string = "Skip to links";

  // @ts-ignore
  @api 
  nav?: string;

  // @ts-ignore
  @api 
  navLabel: string = "Skip to navigation";

  // @ts-ignore
  @api 
  content?: string;

  // @ts-ignore
  @api 
  contentLabel: string = "Skip to content";

  // @ts-ignore
  @api 
  cstyle?: CStyle;
  
  // @ts-ignore
  @api 
  className?: string;

  // @ts-ignore
  @api
  mastheadLabel: string = MASTHEADLABEL_DEFAULT;
  _mastheadLabelHtml = this.defineMarkdownContentProperty("mastheadLabel", {
    errorCode: "ML-MD",
    errorText: "Issue when parsing Masthead label markdown"
  });

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("nsw-scope");
  }

  renderedCallback() {
    super.renderedCallback?.();

    const md = this.refs.markdown;
    
    if (md) {
      replaceInnerHtml(md, this._mastheadLabelHtml.value ?? "");
    }
  }
}
