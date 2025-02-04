import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";

export default class extends SfGpsDsLwc {
  @api title;
  @api caption;
  @api imageSrc;
  @api imageAlt;
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

  /* api: summary */

  _summaryHtml;
  _summaryOriginal;

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

  /* computed: _image */

  get _image() {
    return this.imageSrc ? { src: this.imageSrc, alt: this.imageAlt } : null;
  }

  /* lifecycle */

  renderedCallback() {
    const element = this.refs.markdown;

    if (this.summary && element) {
      replaceInnerHtml(element, this._summaryHtml);
    }
  }
}
