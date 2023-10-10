import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";

const MARKDOWN_SELECTOR = ".sf-gps-ds-markdown";

export default class SfGpsDsAuQldBlockquoteComm extends SfGpsDsLwc {
  @api className;

  /* api reference */

  _referenceOriginal;
  _reference;

  @api get reference() {
    return this._referenceOriginal;
  }

  set reference(markdown) {
    this._refferenceOriginal = markdown;

    try {
      this._reference = mdEngine.extractFirstLink(markdown);
    } catch (e) {
      this.addError("ML-MD", "Issue when parsing reference markdown");
      this._reference = null;
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
