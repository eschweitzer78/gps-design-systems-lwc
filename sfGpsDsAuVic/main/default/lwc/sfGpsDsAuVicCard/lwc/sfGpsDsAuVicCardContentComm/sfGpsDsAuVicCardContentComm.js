import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";

export default class extends SfGpsDsLwc {
  @api image;
  @api imageAlt;
  @api focalPointX;
  @api focalPointY;
  @api width;
  @api height;
  @api border = false;
  @api center = false;
  @api type = "default"; // default, simple, inline
  @api className;

  /* api: link */

  _link;
  _linkOriginal;

  @api
  get link() {
    return this._linkOriginal;
  }

  set link(markdown) {
    try {
      this._linkOriginal = markdown;
      this._link = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError("HL-MD", "Issue when parsing link markdown.");
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

      if (markdown) {
        this._contentHtml = this.useMarkup
          ? markdown
          : mdEngine.renderEscaped(markdown);
      } else {
        this._contentHtml = null;
      }
    } catch (e) {
      this.addError("CO-MD", "Issue when parsing Content markdown");
    }
  }

  /* computed */

  get computedFocalPoint() {
    return this.focalPointX && this.focalPointY
      ? { x: this.focalPointX, y: this.focalPointY }
      : null;
  }

  /* lifecycle */

  renderedCallback() {
    if (this.content) {
      replaceInnerHtml(this.refs.markdown, this._contentHtml);
    }
  }
}
