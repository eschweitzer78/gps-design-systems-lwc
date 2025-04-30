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

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuQldFooterLwr";

/**
 * @slot ContactUs
 * @slot FooterNav
 * @slot FooterLinks
 */
export default class extends SfGpsDsLwc {
  @api title;
  @api cstyle;
  @api linksHeading;
  @api navHeading;
  @api socialHeading;
  @api facebookUrl;
  @api instagramUrl;
  @api linkedInUrl;
  @api youTubeUrl;
  @api twitterXUrl;
  @api acknowledgementsHeading;
  @api acknowledgements;
  @api logoUrl;
  @api className;

  /* api: logo */

  _logo;
  _logoOriginal;

  @api
  get logo() {
    return this._logoOriginal;
  }

  set logo(markdown) {
    try {
      this._logoOriginal = markdown;
      this._logo = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError("HL-MD", "Issue when parsing Logo markdown");
      if (DEBUG) console.debug(CLASS_NAME, "set logo", e);
    }
  }

  /* api: copyrightMention */

  _copyrightMentionHtml;
  _copyrightMentionOriginal;

  @api
  get copyrightMention() {
    return this._copyrightMentionOriginal;
  }

  set copyrightMention(markdown) {
    try {
      this._copyrightMentionOriginal = markdown;
      this._copyrightMentionHtml = mdEngine.renderEscapedUnpackFirstP(markdown);
    } catch (e) {
      this.addError("CM-MD", "Issue when parsing Copyright mention markdown");
      if (DEBUG) console.debug(CLASS_NAME, "set copyrightMention", e);
    }
  }

  /* api: copyrightLink */

  _copyrightLink;
  _copyrightLinkOriginal;

  @api
  get copyrightLink() {
    return this._copyrightLinkOriginal;
  }

  set copyrightLink(markdown) {
    try {
      this._copyrightLinkOriginal = markdown;
      this._copyrightLink = markdown
        ? mdEngine.extractFirstLink(markdown)
        : null;
    } catch (e) {
      this.addError("HL-MD", "Issue when parsing Copyright Link markdown");
      if (DEBUG) console.debug(CLASS_NAME, "set copyrightLink", e);
    }
  }

  /* computed */

  get computedLogoUrl() {
    return this._logo?.url;
  }

  get computedLogoText() {
    return this._logo?.text;
  }

  get computedCopyrightLinkUrl() {
    return this._copyrightLink?.url;
  }

  get computedCopyrightLinkText() {
    return this._copyrightLink?.text;
  }

  /* lifecycle */

  connectedCallback() {
    this._isLwrOnly = true;
    super.connectedCallback();
    this.classList.add("qld-scope");
  }

  renderedCallback() {
    replaceInnerHtml(this.refs.copyright, this._copyrightMentionHtml || "");
  }
}
