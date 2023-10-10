import { api, track } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVicCampaignSecondaryComm extends SfGpsDsLwc {
  @api title;

  /* api: link */

  _linkOriginal;
  @track _link;

  @api get link() {
    return this._linkOriginal;
  }

  set link(markdown) {
    this._linkOriginal = markdown;

    try {
      this._link = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError("HL-MD", "Issue when parsing Link markdown");
    }
  }

  @api imageSrc;
  @api imageAlt;

  @api videoSrc;

  /* api videoMediaLink */

  _videoMediaLinkOriginal;
  _videoMediaLink;

  @api get videoMediaLink() {
    return this._videoMediaLinkOriginal;
  }

  set videoMediaLink(markdown) {
    this._videoMediaLinkOriginal = markdown;

    try {
      this._videoMediaLink = markdown
        ? mdEngine.extractFirstLink(markdown)
        : null;
    } catch (e) {
      this.addError("VM-MD", "Issue when parsing VideoMeadiaLink markdown");
    }
  }

  /* api: summary */

  _summaryOriginal;
  _summaryHtml;

  @api get summary() {
    return this._summaryOriginal;
  }

  set summary(markdown) {
    this._summaryOriginal = markdown;

    try {
      this._summaryHtml = mdEngine.renderEscaped(markdown);
    } catch (e) {
      this.addError("CO-MD", "Issue when parsing Summary markdown");
    }
  }

  @api className;

  /* computed: _image */

  get _image() {
    return this.imageSrc ? { src: this.imageSrc, alt: this.imageAlt } : null;
  }

  /* computed: _video */

  get _video() {
    return this.videoSrc
      ? { src: this.videoSrc, mediaLink: this._videoMediaLink }
      : null;
  }

  /* lifecycle */

  renderedCallback() {
    if (this.summary) {
      let element = this.template.querySelector(".sf-gps-ds-markdown");

      if (element) {
        replaceInnerHtml(element, this._summaryHtml);
      }
    }
  }
}
