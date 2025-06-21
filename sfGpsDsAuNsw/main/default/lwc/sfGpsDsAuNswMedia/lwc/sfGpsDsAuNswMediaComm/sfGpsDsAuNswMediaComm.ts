/*
 * Copyright (c) 2024-2025, Emmanuel Schweitzer and salesforce.com, inc.
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
  CStyle, 
  Position 
} from "c/sfGpsDsAuNswMedia";

// eslint-disable-next-line no-unused-vars
const DEBUG = false;
// eslint-disable-next-line no-unused-vars
const CLASS_NAME = "sfGpsDsAuNswMediaComm";

/**
 * @slot Caption
 */
export default 
class sfGpsDsAuNswMediaComm
extends SfGpsDsLwc {
  // @ts-ignore
  @api 
  cstyle: CStyle = "default";

  // @ts-ignore
  @api 
  image?: string;

  // @ts-ignore
  @api 
  imageAlt?: string;

  // @ts-ignore
  @api 
  video?: string;

  // @ts-ignore
  @api 
  videoTitle?: string;

  // @ts-ignore
  @api 
  position?: Position;

  // @ts-ignore
  @api 
  className?: string;

  // @ts-ignore
  @api 
  caption?: string;
  _captiontHtml = this.defineMarkdownContentProperty("content", {
    errorCode: "CO-MD",
    errorText: "Issue when parsing Caption markdown"
  });

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("nsw-scope");
  }

  renderedCallback() {
    super.renderedCallback?.();

    if (this._captiontHtml.value && this.refs.caption) {
      replaceInnerHtml(this.refs.caption, this._captiontHtml.value);
    }
  }
}
