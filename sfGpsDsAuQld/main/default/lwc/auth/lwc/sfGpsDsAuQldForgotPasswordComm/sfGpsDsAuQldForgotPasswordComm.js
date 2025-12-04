/*
 * Copyright (c) 2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsAuthForgotPassword from "c/sfGpsDsAuthForgotPassword";
import mdEngine from "c/sfGpsDsMarkdown";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";
import tmpl from "./sfGpsDsAuQldForgotPasswordComm.html";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsAuQldForgotPasswordComm";

/**
 * @slot description
 */
export default class extends SfGpsDsAuthForgotPassword {
  @api title;
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
      this.addError("CO-MD", "Issue when parsing Description markdown");
      if (DEBUG) console.debug(CLASS_NAME, "set description", e);
    }
  }

  /* lifecycle */

  render() {
    return tmpl;
  }

  renderedCallback() {
    if (super.renderedCallback) super.renderedCallback();

    const description = this.refs.description;

    if (description && this._descriptionHtml) {
      replaceInnerHtml(description, this._descriptionHtml);
    }
  }
}
