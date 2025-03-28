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

  @api contentId;
  @api mainNavId;
  @api headerStyle;
  @api headerUrl;
  @api title;
  @api subtitle;
  @api siteLogoSecondary;
  @api siteLogoSecondaryMobile;
  @api className;

  /* api: preHeaderLogo */

  _preHeaderLogo;
  _preHeaderLogoOriginal;

  @api
  get preHeaderLogo() {
    return this._preHeaderLogoOriginal;
  }

  set preHeaderLogo(markdown) {
    try {
      this._preHeaderLogoOriginal = markdown;
      this._preHeaderLogo = markdown
        ? mdEngine.extractFirstLink(markdown)
        : null;
    } catch (e) {
      this.addError("HL-PL", "Issue when parsing Pre-header Logo markdown");
    }
  }

  /* api: preHeaderLink */

  _preHeaderLink;
  _preHeaderLinkOriginal;

  @api
  get preHeaderLink() {
    return this._preHeaderLinkOriginal;
  }

  set preHeaderLink(markdown) {
    try {
      this._preHeaderLinkOriginal = markdown;
      this._preHeaderLink = markdown
        ? mdEngine.extractFirstLink(markdown)
        : null;
    } catch (e) {
      this.addError("HL-PH", "Issue when parsing Pre-header Link markdown");
    }
  }

  /* api: ctaOneLink */

  _ctaOneLink;
  _ctaOneLinkOriginal;

  @api
  get ctaOneLink() {
    return this._ctaOneLinkOriginal;
  }

  set ctaOneLink(markdown) {
    try {
      this._ctaOneLinkOriginal = markdown;
      this._ctaOneLink = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError("HL-CO", "Issue when parsing CTA One Link markdown");
    }
  }

  /* api: ctaTwoLink */

  _ctaTwoLink;
  _ctaTwoLinkOriginal;

  @api
  get ctaTwoLink() {
    return this._ctaTwoLinkOriginal;
  }

  set ctaTwoLink(markdown) {
    try {
      this._ctaTwoLinkOriginal = markdown;
      this._ctaTwoLink = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError("HL-CT", "Issue when parsing CTA Two Link markdown");
    }
  }

  /* api: siteLogo */

  _siteLogo;
  _siteLogoOriginal;

  @api
  get siteLogo() {
    return this._siteLogoOriginal;
  }

  set siteLogo(markdown) {
    try {
      this._siteLogoOriginal = markdown;
      this._siteLogo = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError("HL-SL", "Issue when parsing Site Logo markdown");
    }
  }

  /* computed */

  get computedPreHeaderLogoUrl() {
    return this._preHeaderLogo?.url;
  }

  get computedPreHeaderLogoText() {
    return this._preHeaderLogo?.text;
  }

  get computedSiteLogoUrl() {
    return this._siteLogo?.url;
  }

  get computedSiteLogoText() {
    return this._siteLogo?.text;
  }
}
