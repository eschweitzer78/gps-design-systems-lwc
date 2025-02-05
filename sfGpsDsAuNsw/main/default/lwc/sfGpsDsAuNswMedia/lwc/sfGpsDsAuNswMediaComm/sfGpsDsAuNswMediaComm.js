import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";

/**
 * @slot Caption
 */
export default class extends SfGpsDsLwc {
  @api cstyle = "default";
  @api image;
  @api imageAlt;
  @api video;
  @api videoTitle;
  @api position;
  @api className;

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

      if (markdown) {
        this._captionHtml = mdEngine.renderEscaped(markdown);
      } else {
        this._captionHtml = null;
      }
    } catch (e) {
      this.addError("CO-MD", "Issue when parsing Caption markdown");
    }
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("nsw-scope");
  }

  renderedCallback() {
    if (this._captionOriginal) {
      replaceInnerHtml(this.refs.caption, this._captionHtml);
    }
  }
}
