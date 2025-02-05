import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { parseIso8601, replaceInnerHtml } from "c/sfGpsDsHelpers";

/**
 * @slot Caption
 */
export default class extends SfGpsDsLwc {
  @api extension;
  @api size;
  @api updated;
  @api className;

  /* api: name, string in link markdown format */

  _name = {};
  _nameOriginal;

  @api
  get name() {
    return this._nameOriginal;
  }

  set name(markdown) {
    try {
      this._linkOriginal = markdown;
      this._name = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError("HL-MD", "Issue when parsing Name markdown");
      this._name = {};
    }
  }

  /* api: caption */

  _captionHtml;
  _captionOriginal;

  @api
  get caption() {
    return this._captionOriginal;
  }

  set caption(markdown) {
    try {
      this._captionOriginal = markdown;
      this._captionHtml = mdEngine.renderEscaped(markdown);
    } catch (e) {
      this.addError("CO-MD", "Issue when parsing Caption markdown");
    }
  }

  /* computed */

  get computedName() {
    return this._name?.text;
  }

  get computedUrl() {
    return this._name?.url;
  }

  get computedUpdated() {
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
