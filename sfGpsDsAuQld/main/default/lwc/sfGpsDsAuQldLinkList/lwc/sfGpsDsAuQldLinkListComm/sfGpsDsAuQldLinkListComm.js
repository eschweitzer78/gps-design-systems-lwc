/*
 * Copyright (c) 2024, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { isString, toArray } from "c/sfGpsDsHelpers";

const LINKS_DEFAULT = [];

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuQldLinkListComm";

export default class extends SfGpsDsLwc {
  @api listMode;
  @api title;
  @api titleClassName;
  @api linkClassName;
  @api anchorClassName;
  @api iconClassName;
  @api className;

  /* api: links */

  _links = LINKS_DEFAULT;
  _linksOriginal = LINKS_DEFAULT;

  @api
  get links() {
    return this._linksOriginal;
  }

  set links(value) {
    this._linksOriginal = value;

    if (isString(value)) {
      try {
        value = toArray(JSON.parse(value));
      } catch (e) {
        value = LINKS_DEFAULT;
        this.addError(
          "JS-LI",
          "The links attribute must be in JSON array format of text, url and icon."
        );
        if (DEBUG) console.debug(CLASS_NAME, "set links", e);
      }
    } else {
      value = LINKS_DEFAULT;
    }

    this._links = value;
  }

  /* api: cvaLink */

  _cvaLink;
  _cvaLinkOriginal;

  @api
  get cvaLink() {
    return this._cvaLinkOriginal;
  }

  set cvaLink(markdown) {
    try {
      this._cvaLinkOriginal = markdown;
      this._cvaLink = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError(
        "HL-MD",
        "Issue when parsing Column View All Link markdown"
      );
      if (DEBUG) console.debug(CLASS_NAME, "set cvaLink", e);
    }
  }

  /* computed */

  get _cvaText() {
    return this._cvaLink?.text;
  }

  get _cvaUrl() {
    return this._cvaLink?.url;
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("qld-scope");
  }
}
