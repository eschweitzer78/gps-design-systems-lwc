/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 *
 * QLD DS 1.18
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuQldVideoPlayerComm";

/**
 * @slot description
 */
export default class extends SfGpsDsLwc {
  @api videoType;
  @api videoId;
  @api caption;
  @api duration;
  @api transcript;
  @api transcriptLink;
  @api layout;
  @api size;
  @api cstyle;
  @api className;

  /* api: description */

  _descriptionHtml;
  _descriptionOriginal;

  @api
  get description() {
    return this._descriptionOriginal;
  }

  set description(markdown) {
    this._descriptionOriginal = markdown;
    try {
      this._descriptionHtml = markdown
        ? mdEngine.renderEscaped(markdown)
        : null;
    } catch (e) {
      this.addError("CO-MD", "Issue when parsing Copy markdown");
      if (DEBUG) console.debug(CLASS_NAME, "set copy", e);
    }
  }

  /* lifecycle */

  renderedCallback() {
    const description = this.refs.description;

    if (description && this._descriptionHtml) {
      replaceInnerHtml(description, this._descriptionHtml);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("qld-scope");
  }
}
