/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";

const CLOSED_DEFAULT = true;

export default class extends SfGpsDsLwc {
  @api index; // only used if part of a group
  @api header;
  @api content;
  @api className;

  // api: closed

  _closed = CLOSED_DEFAULT;

  @api
  get closed() {
    return this._closed;
  }

  set closed(value) {
    this._closed = value;
  }

  /* event management */

  handleExpand() {
    this._closed = false;
    this.dispatchEvent(new CustomEvent("expand"));
  }

  handleCollapse() {
    this._closed = true;
    this.dispatchEvent(new CustomEvent("collapse"));
  }

  /* lifecycle */

  renderedCallback() {
    replaceInnerHtml(this.refs.markdown, this.content);
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("nsw-scope");
  }
}
