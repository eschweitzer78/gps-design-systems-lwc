/*
 * Copyright (c) 2024, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";

export default class extends SfGpsDsLwc {
  @api direction;
  @api className;

  /* api: link */

  _link;
  _linkOriginal;

  @api
  get link() {
    return this._linkOriginal;
  }

  set link(markdown) {
    this._linkOriginal = markdown;

    try {
      this._link = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError("HL-MD", "Issue when parsing Link markdown");
    }
  }

  /* getters */

  get computedLinkText() {
    return this._link?.text;
  }

  get computedLinkUrl() {
    return this._link?.url;
  }
}
