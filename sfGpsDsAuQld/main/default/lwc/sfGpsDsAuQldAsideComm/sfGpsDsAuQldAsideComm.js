import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";

const MARKDOWN_SELECTOR = ".sf-gps-ds-markdown";

export default class SfGpsDsAuQldAlertComm extends SfGpsDsLwc {
  @api iconName;
  @api iconSize;
  @api title;
  @api className;

  /* api: content */

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

  // lifecycle

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("qld-scope");
  }

  renderedCallback() {
    if (this.content) {
      let element = this.template.querySelector(MARKDOWN_SELECTOR);

      if (element) {
        replaceInnerHtml(element, this._contentHtml);
      }
    }
  }
}
