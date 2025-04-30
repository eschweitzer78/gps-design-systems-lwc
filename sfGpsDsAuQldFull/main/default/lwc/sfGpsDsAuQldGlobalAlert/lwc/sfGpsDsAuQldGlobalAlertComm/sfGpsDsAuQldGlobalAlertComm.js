/*
 * Copyright (c) 2024, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api, track } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuQldGlobalAlertComm";

export default class extends SfGpsDsLwc {
  @api level;
  @api title;
  @api content;
  @api dismissible;
  @api className;

  @track _isOpen = true;

  /* api: link */

  _link;
  _linkOriginal;

  @api
  get link() {
    return this._linkOriginal;
  }

  set link(markdown) {
    try {
      this._linkOriginal = markdown;
      this._link = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError("HL-MD", "Issue when parsing Call to Action markdown");
      if (DEBUG) console.debug(CLASS_NAME, "set link", e);
    }
  }

  /* getters */

  get computedLinkText() {
    return this._link?.text;
  }

  get computedLinkUrl() {
    return this._link?.url;
  }

  /* event management */

  handleClose() {
    if (this.dismissible) {
      this._isOpen = false;
    }
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("qld-scope");
  }
}
