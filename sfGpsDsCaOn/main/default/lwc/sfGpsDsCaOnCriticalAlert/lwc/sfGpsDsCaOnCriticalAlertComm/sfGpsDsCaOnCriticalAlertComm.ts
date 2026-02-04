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
import mdEngine from "c/sfGpsDsMarkdown"
import { replaceInnerHtml } from "c/sfGpsDsHelpers";

// eslint-disable-next-line no-unused-vars
const DEBUG = false;
// eslint-disable-next-line no-unused-vars
const CLASS_NAME = "SfGpsDsCaOnCriticalAlertComm";

/**
 * @slot Callout-Content
 */
export default 
class SfGpsDsCaOnCriticalAlertComm 
extends SfGpsDsLwc {
  // @ts-ignore
  @api 
  content?: string;
  _contentHtml = this.defineMarkdownContentProperty("content", {
    parseFunction: (markdown: string) => mdEngine.renderEscapedUnpackFirstP(markdown),
    errorCode: "CO-MD",
    errorText: "Issue when parsing Content markdown"
  });

  // @ts-ignore
  @api 
  className?: string;

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }

  renderedCallback() {
    super.renderedCallback();

    if (this.refs.content) {
      replaceInnerHtml(this.refs.content, this._contentHtml.value);
    }
  }
}
