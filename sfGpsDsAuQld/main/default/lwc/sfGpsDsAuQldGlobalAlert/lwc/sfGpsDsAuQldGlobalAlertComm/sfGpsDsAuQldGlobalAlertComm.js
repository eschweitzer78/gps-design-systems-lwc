/*
 * Copyright (c) 2024, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api, track } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";

export default class extends SfGpsDsLwc {
  @api level;
  @api title;
  @api copy;
  @api className;

  @track _isOpen = true;

  /* api: cta */

  _cta;
  _ctaOriginal;

  @api get cta() {
    return this._ctaOriginal;
  }

  set cta(markdown) {
    this._ctaOriginal = markdown;

    try {
      this._cta = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError("HL-MD", "Issue when parsing Call to Action markdown");
    }
  }

  /* getters */

  get computedCtaText() {
    return this._cta?.text;
  }

  get computedCtaUrl() {
    return this._cta?.url;
  }

  /* event management */

  handleClose() {
    this._isOpen = false;
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("qld-scope");
  }
}
