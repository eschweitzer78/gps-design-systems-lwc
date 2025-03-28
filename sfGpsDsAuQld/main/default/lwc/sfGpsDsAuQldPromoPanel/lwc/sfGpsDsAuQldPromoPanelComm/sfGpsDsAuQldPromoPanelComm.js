/*
 * Copyright (c) 2024, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";

/**
 * @slot panelContent
 */
export default class extends SfGpsDsLwc {
  @api type;
  @api title;
  @api abstract;
  @api backgroundColour;
  @api icon;
  @api image;
  @api imageAlignment;
  @api linkType;
  @api className;

  /* api: content */

  _contentHtml;
  _contentOriginal;

  @api
  get content() {
    return this._contentOriginal;
  }

  set content(markdown) {
    try {
      this._contentOriginal = markdown;
      this._contentHtml = mdEngine.renderEscaped(markdown);
    } catch (e) {
      this.addError("CO-MD", "Issue when parsing Content markdown");
    }
  }

  /* api: cta */

  _cta;
  _ctaOriginal;

  @api
  get cta() {
    return this._ctaOriginal;
  }

  set cta(markdown) {
    try {
      this._ctaOriginal = markdown;
      this._cta = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError("CT-MD", "Issue when parsing CTA markdown");
    }
  }

  /* api: buttonPrimary */

  _buttonPrimary;
  _buttonPrimaryOriginal;

  @api
  get buttonPrimary() {
    return this._buttonPrimaryOriginal;
  }

  set buttonPrimary(markdown) {
    try {
      this._buttonPrimaryOriginal = markdown;
      this._buttonPrimary = markdown
        ? mdEngine.extractFirstLink(markdown)
        : null;
    } catch (e) {
      this.addError("PB-MD", "Issue when parsing Primary button markdown");
    }
  }

  /* api: buttonSecondary */

  _buttonSecondary;
  _buttonSecondaryOriginal;

  @api
  get buttonSecondary() {
    return this._buttonSecondaryOriginal;
  }

  set buttonSecondary(markdown) {
    try {
      this._buttonSecondaryOriginal = markdown;
      this._buttonSecondary = markdown
        ? mdEngine.extractFirstLink(markdown)
        : null;
    } catch (e) {
      this.addError("SB-MD", "Issue when parsing Secondary button markdown");
    }
  }

  /* getters */

  get computedCtaLinkUrl() {
    return this._cta?.url;
  }

  get computedCtaLinkText() {
    return this._cta?.text;
  }

  get computedPrimaryLinkUrl() {
    return this._buttonPrimary?.url;
  }

  get computedPrimaryLinkText() {
    return this._buttonPrimary?.text;
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("qld-scope");
  }

  renderedCallback() {
    const md = this.refs.markdown;

    if (this._contentOriginal && md) {
      replaceInnerHtml(md, this._contentHtml || "");
    }
  }
}
