/*
 * Copyright (c) 2024, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api, track } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";

export default class SfGpsDsAuNswLinkListComm extends SfGpsDsLwc {
  @api listMode;
  @api title;
  @api titleClassName;
  @api linkClassName;
  @api anchorClassName;
  @api iconClassName;
  @api className;

  /*
   * links
   */

  @track _links;
  _originalLinks;

  @api get links() {
    return this._originalLinks;
  }

  set links(value) {
    this._originalLinks = value;

    if (typeof value === "string") {
      try {
        value = JSON.parse(value);
        if (!Array.isArray(value)) {
          value = [value];
        }
      } catch (e) {
        value = [];
        this.addError(
          "JS-LI",
          "The links attribute must be in JSON array format of text, url and icon."
        );
      }
    } else {
      value = [];
    }

    this._links = value;
  }

  /*
   * api: cvaLink
   */

  _cvaLink;
  _cvaLinkOriginal;

  @api get cvaLink() {
    return this._cvaLinkOriginal;
  }

  set cvaLink(markdown) {
    this._cvaLinkOriginal = markdown;

    try {
      this._cvaLink = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError(
        "HL-MD",
        "Issue when parsing Column View All Link markdown"
      );
    }
  }

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
