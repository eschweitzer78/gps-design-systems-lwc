/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/*
 * TODO/THOUGHTS:
 *
 * Using SVG icons from Experience Builder is not optimal.
 * SVG Files could be on the larger side and we only have a single line text field.
 * CMS does not support SVG with the Image document type, except if it's an URL-based piece of content.
 * Could perhaps have an attribute letting the user decide if the img is to be rendered as nsw-content-block__image
 * or nsw-content-block__icon?
 *
 * In the meantime we tweaked the original markup to display a 96px Material icon.
 *
 */

import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";

export default class extends SfGpsDsLwc {
  @api headline;
  @api image;
  @api imageAlt;
  @api icon;
  @api className;

  // This is not exposed in Experience Builder and is used by contentBlockCollectionComm
  @api useMarkup = false;

  /* api: links */

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
    }
  }

  /* api: copy, String */

  _copyHtml;
  _copyOriginal;

  @api
  get copy() {
    return this._copyOriginal;
  }

  set copy(markdown) {
    try {
      this._copyOriginal = markdown;

      if (markdown) {
        this._copyHtml = this.useMarkup
          ? markdown
          : mdEngine.renderEscaped(markdown);
      } else {
        this._copyHtml = null;
      }
    } catch (e) {
      this.addError("CO-MD", "Issue when parsing Copy markdown");
    }
  }

  /* api: mainLink, String */

  _mainLink;
  _mainLinkOriginal;

  @api
  get mainLink() {
    return this._mainLinkOriginal;
  }

  set mainLink(markdown) {
    try {
      this._mainLinkOriginal = markdown;
      this._mainLink = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError("ML-MD", "Issue when parsing MainLink markdown");
    }
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("nsw-scope");
  }

  renderedCallback() {
    if (this._copyOriginal) {
      replaceInnerHtml(this.refs.markdown, this._copyHtml);
    }
  }
}
