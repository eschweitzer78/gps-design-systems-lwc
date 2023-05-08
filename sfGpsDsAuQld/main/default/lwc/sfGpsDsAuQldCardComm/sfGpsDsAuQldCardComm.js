import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";

const MARKDOWN_SELECTOR = ".sf-gps-ds-markdown";

export default class SfGpsDsAuQldCardComm extends SfGpsDsLwc {
  @api theme;
  @api imageSrc;
  @api imageAlt;
  @api isThumbnail = false;

  @api ctaStyle;
  @api className;

  /* api: titleLink */

  _titleLinkOriginal;
  _titleLink;

  @api get titleLink() {
    return this._titleLinkOriginal;
  }

  set titleLink(markdown) {
    this._titleLinkOriginal = markdown;

    try {
      let bl = mdEngine.extractFirstLink(markdown);
      this._titleLink = bl && bl.text ? bl : null;
    } catch (e) {
      this.addError("ML-MD", "Issue when parsing titleLink markdown");
      this._titleLink = null;
    }
  }

  /* api: ctaLink */

  _ctaLinkOriginal;
  _ctaLink;

  @api get ctaLink() {
    return this._ctaLinkOriginal;
  }

  set ctaLink(markdown) {
    this._ctaLinkOriginal = markdown;

    try {
      let bl = mdEngine.extractFirstLink(markdown);
      this._ctaLink = bl && bl.text ? bl : null;
    } catch (e) {
      this.addError("ML-MD", "Issue when parsing ctaLink markdown");
      this._ctaLink = null;
    }
  }

  /* api: content */

  _contentOriginal;
  _contentHtml;
  _contentRendered;

  @api get content() {
    return this._contentOriginal;
  }

  set content(markdown) {
    this._contentOriginal = markdown;

    try {
      this._contentHtml = mdEngine.renderEscaped(markdown);
      this._contentRendered = false;
    } catch (e) {
      this.addError("CO-MD", "Issue when parsing Content markdown");
    }
  }

  // lifecycle

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("qld-scope");
  }

  renderedCallback() {
    if (this.content) {
      let element = this.template.querySelector(MARKDOWN_SELECTOR);

      if (element) {
        replaceInnerHtml(element, this._contentHtml);
      }
    }
  }
}
