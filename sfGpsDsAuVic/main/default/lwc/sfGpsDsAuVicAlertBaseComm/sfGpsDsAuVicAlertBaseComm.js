import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";

const MARKDOWN_SELECTOR = ".sf-gps-ds-markdown";

export default class SfGpsDsAuVicAlertBaseComm extends SfGpsDsLwc {
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

  @api backgroundColor;
  @api textColor;
  @api iconSymbol;
  @api iconColor;
  @api closeIconColor;
  @api className;

  renderedCallback() {
    if (this.content) {
      let element = this.template.querySelector(MARKDOWN_SELECTOR);
      if (element) {
        replaceInnerHtml(element, this._contentHtml);
      }
    }
  }

  handleClose() {
    this.dispatchEvent(new CustomEvent("close"));
  }
}
