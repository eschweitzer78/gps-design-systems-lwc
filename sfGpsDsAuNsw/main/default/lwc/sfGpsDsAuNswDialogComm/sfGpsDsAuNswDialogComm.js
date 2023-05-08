import { api, track } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuNswDialogComm extends SfGpsDsLwc {
  @api title;
  @api primaryButtonText;
  @api secondaryButtonText;
  @api bstyle; // one of dark, danger
  @api isDismissible = false;
  @api className;

  @track _isOpen = false;

  /*
   * content
   */

  _content;
  _contentHtml;

  @api get content() {
    return this._content;
  }

  set content(markdown) {
    this._content = markdown;
    try {
      this._contentHtml = markdown ? mdEngine.renderEscaped(markdown) : "";
    } catch (e) {
      this.addError("IN-MD", "Issue when parsing Content markdown");
    }
  }

  get computedButtonLabel() {
    return `Open ${this.title}`;
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("nsw-scope");
  }

  renderedCallback() {
    if (this.content) {
      let element = this.template.querySelector(".sf-gps-ds-markdown");

      if (element) {
        replaceInnerHtml(element, this._contentHtml);
      }
    }
  }

  /* events */

  handleClick() {
    this._isOpen = true;
  }

  handleDismissed() {
    this._isOpen = false;
  }
}
