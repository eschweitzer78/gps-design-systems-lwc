import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";

export default class extends SfGpsDsLwc {
  @api preHeaderStyle;
  @api ctaOneIcon;
  @api ctaTwoIcon;

  @api searchLabel;
  @api searchFieldLabel;
  @api menuLabel;

  @api mainNavId;
  @api headerStyle;
  @api headerUrl;
  @api siteLogoSecondary;
  @api siteLogoSecondaryMobile;
  @api title;
  @api subtitle;
  @api className;

  /*
   * api: preHeaderLogo
   */

  _preHeaderLogo;
  _preHeaderLogoOriginal;

  @api get preHeaderLogo() {
    return this._preHeaderLogoOriginal;
  }

  set preHeaderLogo(markdown) {
    this._preHeaderLogoOriginal = markdown;

    try {
      this._preHeaderLogo = markdown
        ? mdEngine.extractFirstLink(markdown)
        : null;
    } catch (e) {
      this.addError("HL-MD", "Issue when parsing Pre-header Logo markdown");
    }
  }

  get computedPreHeaderLogoUrl() {
    return this._preHeaderLogo?.url;
  }

  get computedPreHeaderLogoText() {
    return this._preHeaderLogo?.text;
  }

  /*
   * api: preHeaderLink
   */

  _preHeaderLink;
  _preHeaderLinkOriginal;

  @api get preHeaderLink() {
    return this._preHeaderLinkOriginal;
  }

  set preHeaderLink(markdown) {
    this._preHeaderLinkOriginal = markdown;

    try {
      this._preHeaderLink = markdown
        ? mdEngine.extractFirstLink(markdown)
        : null;
    } catch (e) {
      this.addError("HL-MD", "Issue when parsing Pre-header Link markdown");
    }
  }

  /*
   * api: ctaOneLink
   */

  _ctaOneLink;
  _ctaOneLinkOriginal;

  @api get ctaOneLink() {
    return this._ctaOneLinkOriginal;
  }

  set ctaOneLink(markdown) {
    this._ctaOneLinkOriginal = markdown;

    try {
      this._ctaOneLink = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError("HL-MD", "Issue when parsing CTA One Link markdown");
    }
  }

  /*
   * api: ctaTwoLink
   */

  _ctaTwoLink;
  _ctaTwoLinkOriginal;

  @api get ctaTwoLink() {
    return this._ctaTwoLinkOriginal;
  }

  set ctaTwoLink(markdown) {
    this._ctaTwoLinkOriginal = markdown;

    try {
      this._ctaTwoLink = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError("HL-MD", "Issue when parsing CTA Two Link markdown");
    }
  }

  /*
   * api: siteLogo
   */

  _siteLogo;
  _siteLogoOriginal;

  @api get siteLogo() {
    return this._siteLogoOriginal;
  }

  set siteLogo(markdown) {
    this._siteLogoOriginal = markdown;

    try {
      this._siteLogo = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError("HL-MD", "Issue when parsing Site Logo markdown");
    }
  }

  get computedSiteLogoUrl() {
    return this._siteLogo?.url;
  }

  get computedSiteLogoText() {
    return this._siteLogo?.text;
  }
}
