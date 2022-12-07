/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { api, track } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuNswHeroBannerComm extends SfGpsDsLwc {
  @api title;
  @api subtitle;
  @api cstyle;
  @api wide;
  @api featured;
  @api image;
  @api imageAlt;
  @api className;

  /*
   * cta
   */

  @track _cta;
  _originalCta;

  @api get cta() {
    return this._originalCta;
  }

  set cta(markdown) {
    this._originalCta = markdown;

    try {
      this._cta = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError("CTA-MD", "Issue when parsing Call to action markdown");
    }
  }

  /*
   * links
   */

  @track _links;
  _originalLinks;

  @api get links() {
    return this._originalLinks;
  }

  set links(markdown) {
    this._originalLinks = markdown;

    try {
      if (markdown) {
        this._links = mdEngine.extractLinks(markdown);
      } else {
        this._links = null;
      }
    } catch (e) {
      this.addError("LI-MD", "Issue when parsing Links markdown");
    }
  }

  /*
   * intro
   */

  _intro;
  _introHtml;

  @api get intro() {
    return this._intro;
  }

  set intro(markdown) {
    this._intro = markdown;
    try {
      this._introHtml = markdown ? mdEngine.render(markdown) : "";
    } catch (e) {
      this.addError("IN-MD", "Issue when parsing Intro markdown");
    }
  }

  get computedImage() {
    return this.image ? { src: this.image, alt: this.imageAlt } : null;
  }

  _rendered = false;

  renderedCallback() {
    if (this._rendered === false) {
      let element;

      if (this.intro) {
        if ((element = this.template.querySelector(".sfGpsMarkdown"))) {
          replaceInnerHtml(element, this._introHtml);
        } else {
          this.addError(
            "CO-PH",
            "Couldn't find internal intro markdown placeholder"
          );
        }
      }

      this._rendered = true;
    }
  }
}
