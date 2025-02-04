import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";

export default class extends SfGpsDsLwc {
  @api backgroundColor;
  @api textColor;
  @api iconSymbol;
  @api iconColor;
  @api closeIconColor;
  @api className;

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

  /* event management */

  handleClose() {
    this.dispatchEvent(new CustomEvent("close"));
  }

  /* lifecycle */

  renderedCallback() {
    const element = this.refs.markdown;

    if (this.content && element) {
      replaceInnerHtml(element, this._contentHtml);
    }
  }
}
