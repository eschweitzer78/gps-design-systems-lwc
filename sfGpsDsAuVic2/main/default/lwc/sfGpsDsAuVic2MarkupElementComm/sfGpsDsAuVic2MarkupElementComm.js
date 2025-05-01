/*
 * Copyright (c) 2024-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import defaultPlugIns from "c/sfGpsDsAuVic2HtmlPlugIns";
import { replaceInnerHtml, HtmlSanitizer } from "c/sfGpsDsHelpers";

export default class extends SfGpsDsLwc {
  @api className;

  /* api: markup */

  _markup;
  _markupOriginal;

  @api
  get markup() {
    return this._markupOriginal;
  }

  set markup(value) {
    this._markupOriginal = value;
    this._markup = HtmlSanitizer.sanitize(value, defaultPlugIns);
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("vic2-scope");
  }

  renderedCallback() {
    replaceInnerHtml(this.refs.markup, this.markup || "");
  }
}
