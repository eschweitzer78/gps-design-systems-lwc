import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { parseIso8601, replaceInnerHtml } from "c/sfGpsDsHelpers";

/**
 * @slot Caption
 */
export default class SfGpsDsAuVic2FileComm extends SfGpsDsLwc {
  @api extension;
  @api size;
  @api updated;
  @api className;

  /* api: name, string in link markdown format */

  _nameOriginal;
  _name = {};

  @api get name() {
    return this._nameOriginal;
  }

  set name(markdown) {
    this._linkOriginal = markdown;

    try {
      this._name = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError("HL-MD", "Issue when parsing Name markdown");
      this._name = {};
    }
  }

  /* api: caption */

  _captionOriginal;
  _captionHtml;

  @api get caption() {
    return this._captionOriginal;
  }

  set caption(markdown) {
    this._captionOriginal = markdown;

    try {
      this._captionHtml = mdEngine.renderEscaped(markdown);
    } catch (e) {
      this.addError("CO-MD", "Issue when parsing Caption markdown");
    }
  }

  get computedName() {
    return this._name?.text;
  }

  get computedUrl() {
    return this._name?.url;
  }

  get parsedUpdated() {
    return this.updated ? parseIso8601(this.updated) : null;
  }

  /* lifecycle */

  renderedCallback() {
    if (this.refs.caption && this.caption) {
      replaceInnerHtml(this.refs.caption, this._captionHtml);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("vic2-scope");
  }
}
