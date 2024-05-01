import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";

/**
 * @slot Content
 */
export default class extends SfGpsDsLwc {
  @api title;
  @api image;
  @api className;

  /* api: link */

  _linkOriginal;
  _link;

  @api get link() {
    return this._linkOriginal;
  }

  set link(markdown) {
    this._linkOriginal = markdown;

    try {
      this._link = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this._link = null;
      this.addError("ML-MD", "Issue when parsing Link markdown");
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

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("vic2-scope");
  }

  renderedCallback() {
    if (this._contentOriginal) {
      replaceInnerHtml(this.refs.content, this._contentHtml);
    }
  }
}
