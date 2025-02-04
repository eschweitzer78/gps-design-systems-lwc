import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";

export default class extends SfGpsDsLwc {
  @api imageSrc;
  @api imageAlt;
  @api className;

  /* api: titleLink: String in Markdown format */

  _titleLabel;
  _titleUrl;
  _titleLinkOriginal;

  @api
  get titleLink() {
    return this._titleLinkOriginal;
  }

  set titleLink(markdown) {
    try {
      this._titleLinkOriginal = markdown;
      const { url, text } = mdEngine.extractFirstLink(markdown);
      this._titleUrl = url;
      this._titleLabel = text;
    } catch (e) {
      this.addError("TL-MD", "Issue when parsing titleLink markdown");
    }
  }

  /* api: content, String in Markdown format */

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

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("nsw-scope");
  }

  renderedCallback() {
    if (this._contentOriginal) {
      /*
       * We have to add an empty span if there is a title to trigger the appropriate css for *+p and similar
       * as the react component would have one for the title in the same scope,
       * but here our containment hierarchy is a bit different.
       */

      const markup =
        (this._titleLabel ? "<span></span>" : "") + (this._contentHtml || "");
      replaceInnerHtml(this.refs.content, markup);
    }
  }
}
