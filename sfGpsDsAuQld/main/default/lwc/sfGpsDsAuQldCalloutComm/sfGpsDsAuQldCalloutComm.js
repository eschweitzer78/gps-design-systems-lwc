import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";

const MARKDOWN_SELECTOR = ".sf-gps-ds-markdown";

export default class SfGpsDsAuQldACalloutComm extends SfGpsDsLwc {
  @api title;
  @api theme;
  @api imageSrc;
  @api imageAlt;
  @api className;

  /* api buttonLink */

  _buttonLinkOriginal;
  _buttonLink;

  @api get buttonLink() {
    return this._buttonLinkOriginal;
  }

  set buttonLink(markdown) {
    this._buttonLinkOriginal = markdown;

    try {
      let bl = mdEngine.extractFirstLink(markdown);
      this._buttonLink = bl && bl.text ? bl : null;
    } catch (e) {
      this.addError("ML-MD", "Issue when parsing buttonLink markdown");
      this._buttonLink = null;
    }
  }

  /* api: content */

  _contentOriginal;
  _contentHtml;

  @api get content() {
    return this._contentOriginal;
  }

  set content(markdown) {
    this._contentOriginal = markdown;

    try {
      this._contentHtml = mdEngine.renderEscaped(markdown);
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
