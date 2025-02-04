/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";

const CTA_DEFAULT = {};

export default class extends SfGpsDsLwc {
  @api title;
  @api copy;
  @api as = "default";
  @api ctaStyle = "link";
  @api className;

  /* api: cta */

  _cta = CTA_DEFAULT;
  _ctaOriginal;

  @api
  get cta() {
    return this._ctaOriginal;
  }

  set cta(markdown) {
    try {
      this._ctaOriginal = markdown;
      this._cta = markdown ? mdEngine.extractFirstLink(markdown) : {};
    } catch (e) {
      this.addError("CTA-MD", "Issue when parsing cta markdown");
      this._cta = CTA_DEFAULT;
    }
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("nsw-scope");
  }
}
