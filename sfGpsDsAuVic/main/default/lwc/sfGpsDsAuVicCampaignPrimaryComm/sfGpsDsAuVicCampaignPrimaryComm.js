import { api, track } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVicCampaignPrimaryComm extends SfGpsDsLwc {
  @api title;
  @api caption;

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

  /* lifecycle */

  _rendered;

  renderedCallback() {
    if (!this._rendered) {
      let element = this.template.querySelector(".sfGpsMarkdown");

      if (element) {
        replaceInnerHtml(element, this._summaryHtml);
      } else {
        this.addError(
          "CO-PH",
          "Couldn't find internal Summary markdown placeholder"
        );
      }

      this._rendered = true;
    }
  }
}
