import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";

/**
 * @slot Caption
 */
export default class SfGpsDsAuNswMediaComm extends SfGpsDsLwc {
  @api cstyle = "none";
  @api image;
  @api imageAlt;
  @api video;
  @api position;
  @api className;

  // This is not exposed in Experience Builder
  @api useMarkup = false;

  /*
   * caption
   */

  _caption;
  _captionHtml;

  @api get caption() {
    return this._caption;
  }

  set caption(markdown) {
    this._caption = markdown;
    try {
      if (markdown) {
        this._captionHtml = this.useMarkup
          ? markdown
          : mdEngine.renderEscaped(markdown);
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
}
