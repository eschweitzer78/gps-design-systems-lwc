import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";

const LINKPRIMARY_DEFAULT = {};
const LINKSECONDARY_DEFAULT = {};

export default class extends SfGpsDsLwc {
  @api title;
  @api introText;
  @api theme;
  @api ctaText;
  @api className;

  /* api: linkPrimary */

  _linkPrimary = LINKPRIMARY_DEFAULT;
  _linkPrimaryOriginal = LINKPRIMARY_DEFAULT;

  @api
  get linkPrimary() {
    return this._linkPrimaryOriginal;
  }

  set linkPrimary(markdown) {
    try {
      this._linkPrimaryOriginal = markdown;
      this._linkPrimary = mdEngine.extractFirstLink(markdown);
    } catch (e) {
      this.addError("LP-MD", "Issue when parsing LinkPrimary markdown");
      this._linkPrimary = LINKPRIMARY_DEFAULT;
    }
  }

  /* api: linkSecondary */

  _linkSecondary = LINKSECONDARY_DEFAULT;
  _linkSecondaryOriginal = LINKSECONDARY_DEFAULT;

  @api
  get linkSecondary() {
    return this._linkSecondaryOriginal;
  }

  set linkSecondary(markdown) {
    try {
      this._linkSecondaryOriginal = markdown;
      this._linkSecondary = mdEngine.extractFirstLink(markdown);
    } catch (e) {
      this.addError("LP-MD", "Issue when parsing LinkSecondary markdown");
      this._linkSecondary = LINKSECONDARY_DEFAULT;
    }
  }
}
