import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";

const TITLE_DEFAULT = { text: "Nav card", url: "#" };

/**
 * @slot Content
 * @slot Meta
 */
export default class extends SfGpsDsLwc {
  @api image;
  @api highlight;
  @api inset;
  @api className;

  /* api: title, string in link markdown format */

  _title = TITLE_DEFAULT;
  _titleOriginal = JSON.stringify(TITLE_DEFAULT);

  @api
  get title() {
    return this._titleOriginal;
  }

  set title(markdown) {
    try {
      this._titleOriginal = markdown;
      this._title = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError("HL-MD", "Issue when parsing Name markdown");
      this._title = TITLE_DEFAULT;
    }
  }

  /* api: content */

  _contentHtml;
  _contentOriginal;

  @api
  get content() {
    return this._contentOriginal;
  }

  set content(markdown) {
    try {
      this._contentOriginal = markdown;
      this._contentHtml = mdEngine.renderEscaped(markdown);
    } catch (e) {
      this.addError("CO-MD", "Issue when parsing Content markdown");
    }
  }

  /* api: meta */

  _metaHtml;
  _metaOriginal;

  @api
  get meta() {
    return this._metaOriginal;
  }

  set meta(markdown) {
    try {
      this._metaOriginal = markdown;
      this._metaHtml = mdEngine.renderEscaped(markdown);
    } catch (e) {
      this.addError("CO-MD", "Issue when parsing Meta markdown");
    }
  }

  /* lifecycle */

  renderedCallback() {
    if (this.refs.content && this.content) {
      replaceInnerHtml(this.refs.content, this._contentHtml);
    }
    if (this.refs.meta && this.meta) {
      replaceInnerHtml(this.refs.meta, this._metaHtml);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("vic2-scope", "sf-gps-ds-au-vic2-grid");
  }
}
