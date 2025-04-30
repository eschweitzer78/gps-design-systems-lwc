/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuNswHeroBannerComm";

export default class extends SfGpsDsLwc {
  @api title;
  @api subtitle;
  @api cstyle;
  @api wide;
  @api featured;
  @api lines;
  @api image;
  @api imageAlt;
  @api className;

  /* api: cta, String */

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
      this.addError("CTA-MD", "Issue when parsing Call to action markdown");
      if (DEBUG) console.debug(CLASS_NAME, "set cta", e);
    }
  }

  /* api: links, String */

  _links;
  _linksOriginal;

  @api
  get links() {
    return this._linksOriginal;
  }

  set links(markdown) {
    try {
      this._linksOriginal = markdown;
      this._links = markdown ? mdEngine.extractLinks(markdown) : null;
    } catch (e) {
      this.addError("LI-MD", "Issue when parsing Links markdown");
      if (DEBUG) console.debug(CLASS_NAME, "set links", e);
    }
  }

  /* api: intro, String */

  _introHtml;
  _introOriginal;

  @api
  get intro() {
    return this._introOriginal;
  }

  set intro(markdown) {
    try {
      this._introOriginal = markdown;
      this._introHtml = markdown ? mdEngine.render(markdown) : "";
    } catch (e) {
      this.addError("IN-MD", "Issue when parsing Intro markdown");
      if (DEBUG) console.debug(CLASS_NAME, "set intro", e);
    }
  }

  /* computed */

  get computedImage() {
    return this.image ? { src: this.image, alt: this.imageAlt } : null;
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("nsw-scope");
  }

  renderedCallback() {
    if (this._introOriginal) {
      replaceInnerHtml(this.refs.markdown, this._introHtml);
    }
  }
}
