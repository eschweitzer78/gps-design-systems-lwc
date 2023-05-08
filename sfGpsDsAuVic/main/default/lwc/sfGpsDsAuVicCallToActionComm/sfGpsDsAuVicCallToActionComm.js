import { api, track } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";

const MARKDOWN_SELECTOR = ".sf-gps-ds-markdown";

export default class SfGpsDsAuVicCallToActionComm extends SfGpsDsLwc {
  @api cstyle; // string: wide, narrow
  @api title;

  /* api: link */

  _originalLink;
  @track _link;

  @api get link() {
    return this._originalLink;
  }

  set link(markdown) {
    this._originalLink = markdown;

    try {
      this._link = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError("HL-MD", "Issue when parsing Link markdown");
    }
  }

  @api imageSrc;
  @api imageAlt;

  /* api: summary */

  //@api summary;

  _originalSummary;
  _summaryHtml;

  @api get summary() {
    return this._originalSummary;
  }

  set summary(markdown) {
    this._originalSummary = markdown;

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

  /* lifecycle */

  renderedCallback() {
    if (this.summary) {
      let element = this.template.querySelector(MARKDOWN_SELECTOR);

      if (element) {
        replaceInnerHtml(element, this._summaryHtml);
      }
    }
  }
}
