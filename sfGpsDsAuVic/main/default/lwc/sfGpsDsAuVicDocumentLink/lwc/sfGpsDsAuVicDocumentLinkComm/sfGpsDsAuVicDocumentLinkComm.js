import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { parseIso8601, replaceInnerHtml } from "c/sfGpsDsHelpers";

const NAME_DEFAULT = {};

export default class extends SfGpsDsLwc {
  // @api url; //  replaced by markdown in name
  @api extension; // string
  @api filesize; // number
  @api updated; // string in ISO format
  @api className; // string

  /* api: name, string in link markdown format */

  _name = NAME_DEFAULT;
  _nameOriginal = NAME_DEFAULT;

  @api
  get name() {
    return this._nameOriginal;
  }

  set name(markdown) {
    try {
      this._linkOriginal = markdown;
      this._name = markdown
        ? mdEngine.extractFirstLink(markdown)
        : NAME_DEFAULT;
    } catch (e) {
      this.addError("HL-MD", "Issue when parsing Name markdown");
      this._name = NAME_DEFAULT;
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

  get computedUpdated() {
    return this.updated ? parseIso8601(this.updated) : null;
  }

  /* lifecycle */

  renderedCallback() {
    const element = this.refs.markdown;

    if (this.caption && element) {
      replaceInnerHtml(element, this._captionHtml);
    }
  }
}
