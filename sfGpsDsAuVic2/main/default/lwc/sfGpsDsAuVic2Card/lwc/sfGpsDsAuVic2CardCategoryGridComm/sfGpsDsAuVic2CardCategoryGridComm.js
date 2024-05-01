import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";

const TITLE_DEFAULT = {};

/**
 * @slot Content
 */
export default class extends SfGpsDsLwc {
  @api image;
  @api className;

  /* api: title, string in link markdown format */

  _titleOriginal;
  _title = TITLE_DEFAULT;

  @api get title() {
    return this._titleOriginal;
  }

  set title(markdown) {
    this._titleOriginal = markdown;

    try {
      this._title = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError("HL-MD", "Issue when parsing Name markdown");
      this._title = TITLE_DEFAULT;
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

  renderedCallback() {
    if (this.refs.content && this.content) {
      replaceInnerHtml(this.refs.content, this._contentHtml);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("vic2-scope");
  }
}
