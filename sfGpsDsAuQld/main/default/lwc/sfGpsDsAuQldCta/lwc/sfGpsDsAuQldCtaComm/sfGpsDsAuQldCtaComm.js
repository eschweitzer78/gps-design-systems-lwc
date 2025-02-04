import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";

export default class extends SfGpsDsLwc {
  @api mode;
  @api className;

  /* api: ctaLink */

  _ctaLink;
  _ctaLinkOriginal;

  @api
  get ctaLink() {
    return this._ctaLinkOriginal;
  }

  set ctaLink(markdown) {
    this._ctaLinkOriginal = markdown;

    try {
      this._ctaLink = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError("HL-MD", "Issue when parsing Call to Action link markdown");
    }
  }

  get computedCtaLinkUrl() {
    return this._ctaLink?.url;
  }

  get computedCtaLinkText() {
    return this._ctaLink?.text;
  }
}
