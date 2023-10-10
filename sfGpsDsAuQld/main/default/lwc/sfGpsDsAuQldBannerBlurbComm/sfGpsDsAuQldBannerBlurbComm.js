import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";

const MARKDOWN_SELECTOR = ".sf-gps-ds-markdown";

export default class SfGpsDsAuQldABannerBlurbComm extends SfGpsDsLwc {
  @api title;
  @api backgroundGraphic;
  @api className;

  /* api linkPrimary */

  _linkPrimaryOriginal;
  _linkPrimary;

  @api get linkPrimary() {
    return this._linkPrimaryOriginal;
  }

  set linkPrimary(markdown) {
    this._linkPrimaryOriginal = markdown;

    try {
      this._linkPrimary = mdEngine.extractFirstLink(markdown);
    } catch (e) {
      this.addError("ML-MD", "Issue when parsing linkPrimary markdown");
      this._linkPrimary = null;
    }
  }

  /* api linkSecondary */

  _linkSecondaryOriginal;
  _linkSecondary;

  @api get linkSecondary() {
    return this._linkSecondaryOriginal;
  }

  set linkSecondary(markdown) {
    this._linkSecondaryOriginal = markdown;

    try {
      this._linkSecondary = mdEngine.extractFirstLink(markdown);
    } catch (e) {
      this.addError("ML-MD", "Issue when parsing linkSecondary markdown");
      this._linkSecondary = null;
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
