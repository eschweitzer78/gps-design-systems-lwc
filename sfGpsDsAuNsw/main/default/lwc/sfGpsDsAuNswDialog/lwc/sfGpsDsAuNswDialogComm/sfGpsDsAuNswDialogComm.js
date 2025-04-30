import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuNswDialogComm";

export default class extends SfGpsDsLwc {
  @api title;
  @api primaryButtonText;
  @api secondaryButtonText;
  @api bstyle; // one of dark, danger
  @api isDismissible = false;
  @api className;

  _isOpen = false;

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
      this._contentHtml = markdown ? mdEngine.renderEscaped(markdown) : "";
    } catch (e) {
      this.addError("IN-MD", "Issue when parsing Content markdown");
      if (DEBUG) console.debug(CLASS_NAME, "set content", e);
    }
  }

  /* computed */

  get computedButtonLabel() {
    return `Open ${this.title}`;
  }

  /* event management */

  handleClick() {
    this._isOpen = true;
  }

  handleDismissed() {
    this._isOpen = false;
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("nsw-scope");
  }

  renderedCallback() {
    if (this._contentOriginal) {
      replaceInnerHtml(this.refs.markdown, this._contentHtml);
    }
  }
}
