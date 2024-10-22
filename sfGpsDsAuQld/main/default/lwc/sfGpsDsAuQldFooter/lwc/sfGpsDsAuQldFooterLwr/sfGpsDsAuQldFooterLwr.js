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

  /*
   * api: logo
   */

  _logo;
  _logoOriginal;

  @api get logo() {
    return this._logoOriginal;
  }

  set logo(markdown) {
    this._logoOriginal = markdown;

    try {
      this._logo = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError("HL-MD", "Issue when parsing Logo markdown");
    }
  }

  get computedLogoUrl() {
    return this._logo?.url;
  }

  get computedLogoText() {
    return this._logo?.text;
  }

  /* api: copyrightMention */

  _copyrightMentionHtml;
  _copyrightMention;

  @api get copyrightMention() {
    return this._copyrightMention;
  }

  set copyrightMention(markdown) {
    this._copyrightMention = markdown;

    try {
      this._copyrightMentionHtml = mdEngine.renderEscapedUnpackFirstP(markdown);
    } catch (e) {
      this.addError("CM-MD", "Issue when parsing Copyright mention markdown");
    }
  }

  /*
   * api: copyrightLink
   */

  _copyrightLink;
  _copyrightLinkOriginal;

  @api get copyrightLink() {
    return this._copyrightLinkOriginal;
  }

  set copyrightLink(markdown) {
    this._copyrightLinkOriginal = markdown;

    try {
      this._copyrightLink = markdown
        ? mdEngine.extractFirstLink(markdown)
        : null;
    } catch (e) {
      this.addError("HL-MD", "Issue when parsing Copyright Link markdown");
    }
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
