/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";

// eslint-disable-next-line no-unused-vars
const DEBUG = false;
// eslint-disable-next-line no-unused-vars
const CLASS_NAME = "SfGpsDsCaOnAccordionComm";

export default class SfGpsDsCaOnAccordionComm extends SfGpsDsLwc {
  static renderMode = "light";
  // @ts-ignore
  @api
  label?: string;

  // @ts-ignore
  @api
  content?: string;
  _contentHtml = this.defineMarkdownContentProperty("content", {
    errorCode: "AC-MD",
    errorText: "Issue when parsing Content markdown"
  });

  // @ts-ignore
  @api
  isOpen?: boolean = false;

  // @ts-ignore
  @api
  className?: string;

  _accordionId = `accordion-${Math.random().toString(36).substring(2, 11)}`;

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
