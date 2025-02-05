import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";

const LINKS_DEFAULT = [];
const MORELINK_DEFAULT = {};

export default class extends SfGpsDsLwc {
  @api title;
  @api introText;
  @api linkHeading;
  @api theme = "light";
  @api showLinks;
  @api logo;
  @api logoAlt;
  @api backgroundGraphic;
  @api className;

  /* api links */

  _links = LINKS_DEFAULT;
  _linksOriginal = LINKS_DEFAULT;

  @api
  get links() {
    return this._linksOriginal;
  }

  set links(markdown) {
    try {
      this._linksOriginal = markdown;
      this._links = mdEngine.extractLinks(markdown);
    } catch (e) {
      this.addError("LI-MD", "Issue when parsing Links markdown");
      this._links = LINKS_DEFAULT;
    }
  }

  /* api: moreLink */

  _moreLink = MORELINK_DEFAULT;
  _moreLinkOriginal = MORELINK_DEFAULT;

  @api
  get moreLink() {
    return this._moreLinkOriginal;
  }

  set moreLink(markdown) {
    try {
      this._moreLinkOriginal = markdown;
      this._moreLink = mdEngine.extractFirstLink(markdown);
    } catch (e) {
      this.addError("ML-MD", "Issue when parsing MoreLink markdown");
      this._moreLink = MORELINK_DEFAULT;
    }
  }

  /* computed */

  get computedLogo() {
    return this.logo ? { src: this.logo, alt: this.logoAlt } : null;
  }
}
