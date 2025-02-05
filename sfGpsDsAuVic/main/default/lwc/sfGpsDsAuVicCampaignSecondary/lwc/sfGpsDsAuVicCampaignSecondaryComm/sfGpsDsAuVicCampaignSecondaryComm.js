import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";

export default class extends SfGpsDsLwc {
  @api title;
  @api imageSrc;
  @api imageAlt;
  @api videoSrc;
  @api className;

  /* api: link */

  _link;
  _linkOriginal;

  @api
  get link() {
    return this._linkOriginal;
  }

  set link(markdown) {
    try {
      this._linkOriginal = markdown;
      this._link = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError("HL-MD", "Issue when parsing Link markdown");
    }
  }

  /* api: videoMediaLink */

  _videoMediaLink;
  _videoMediaLinkOriginal;

  @api
  get videoMediaLink() {
    return this._videoMediaLinkOriginal;
  }

  set videoMediaLink(markdown) {
    try {
      this._videoMediaLinkOriginal = markdown;
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

  @api
  get summary() {
    return this._summaryOriginal;
  }

  set summary(markdown) {
    try {
      this._summaryOriginal = markdown;
      this._summaryHtml = mdEngine.renderEscaped(markdown);
    } catch (e) {
      this.addError("CO-MD", "Issue when parsing Summary markdown");
    }
  }

  /* computed */

  get computedImage() {
    return this.imageSrc ? { src: this.imageSrc, alt: this.imageAlt } : null;
  }

  get computedVideo() {
    return this.videoSrc
      ? { src: this.videoSrc, mediaLink: this._videoMediaLink }
      : null;
  }

  /* lifecycle */

  renderedCallback() {
    const element = this.refs.markdown;

    if (this._summaryOriginal && element) {
      replaceInnerHtml(element, this._summaryHtml);
    }
  }
}
