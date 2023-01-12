import { api, track } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";

export default class SfGpsDsAuVicHeroBannerComm extends SfGpsDsLwc {
  @api title;
  @api introText;
  @api linkHeading;

  /* api links */

  _linksOriginal;
  @track _links = [];

  @api get links() {
    return this._linksOriginal;
  }

  set links(markdown) {
    this._linksOriginal = markdown;

    try {
      this._links = mdEngine.extractLinks(markdown);
    } catch (e) {
      this.addError("LI-MD", "Issue when parsing Links markdown");
      this._links = [];
    }
  }

  /* api moreLink */

  _moreLinkOriginal;
  @track _moreLink = {};

  @api get moreLink() {
    return this._moreLinkOriginal;
  }

  set moreLink(markdown) {
    this._moreLinkOriginal = markdown;

    try {
      this._moreLink = mdEngine.extractFirstLink(markdown);
    } catch (e) {
      this.addError("ML-MD", "Issue when parsing MoreLink markdown");
      this._moreLink = null;
    }
  }

  @api theme = "light";
  @api showLinks;
  @api logo;
  @api logoAlt;
  @api backgroundGraphic;
  @api className;

  get _logo() {
    return this.logo ? { src: this.logo, alt: this.logoAlt } : null;
  }
}
