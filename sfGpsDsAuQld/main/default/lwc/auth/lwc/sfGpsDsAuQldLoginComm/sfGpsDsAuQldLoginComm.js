/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsAuthLogin from "c/sfGpsDsAuthLogin";
import mdEngine from "c/sfGpsDsMarkdown";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";
import tmpl from "./sfGpsDsAuQldLoginComm.html";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsAuQldLoginComm";

/**
 * @slot terms
 */
export default class extends SfGpsDsAuthLogin {
  @api title;
  @api iconName;
  @api iconPosition;
  @api className;

  /* api: terms */

  _termsHtml;
  _termsOriginal;

  @api
  get terms() {
    return this._termsOriginal;
  }

  set terms(markdown) {
    this._termsOriginal = markdown;
    try {
      this._termsHtml = markdown ? mdEngine.renderEscaped(markdown) : null;
    } catch (e) {
      this.addError("CO-MD", "Issue when parsing Terms markdown");
      if (DEBUG) console.debug(CLASS_NAME, "set terms", e);
    }
  }

  /* lifecycle */

  render() {
    return tmpl;
  }

  renderedCallback() {
    if (super.renderedCallback) super.renderedCallback();

    const terms = this.refs.terms;

    if (terms && this._termsHtml) {
      replaceInnerHtml(terms, this._termsHtml);
    }
  }
}
