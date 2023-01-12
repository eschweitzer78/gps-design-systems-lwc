import { api, track } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";

export default class SfGpsDsAuVicHeroBannerCtaComm extends SfGpsDsLwc {
  @api title;
  @api introText;
  @api theme;

  /* api linkPrimary */

  _linkPrimaryOriginal;
  @track _linkPrimary = {};

  @api get linkPrimary() {
    return this._linkPrimaryOriginal;
  }

  set linkPrimary(markdown) {
    this._linkPrimaryOriginal = markdown;

    try {
      this._linkPrimary = mdEngine.extractFirstLink(markdown);
    } catch (e) {
      this.addError("LP-MD", "Issue when parsing LinkPrimary markdown");
      this._linkPrimary = null;
    }
  }

  @api ctaText;

  /* api linkSecondary */

  _linkSecondaryOriginal;
  @track _linkSecondary = {};

  @api get linkSecondary() {
    return this._linkSecondaryOriginal;
  }

  set linkSecondary(markdown) {
    this._linkSecondaryOriginal = markdown;

    try {
      this._linkSecondary = mdEngine.extractFirstLink(markdown);
    } catch (e) {
      this.addError("LP-MD", "Issue when parsing LinkSecondary markdown");
      this._linkSecondary = null;
    }
  }

  @api className;
}
