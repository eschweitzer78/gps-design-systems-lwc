import { api } from "lwc";
import mdEngine from "c/sfGpsDsMarkdown";
import SfGpsDsLwc from "c/sfGpsDsLwc";

const DEBUG = false;
const CLASS_NAME = "c/sfGpsDsAuVic2CalloutComm";

/**
 * @slot Content
 */
export default class extends SfGpsDsLwc {
  @api title;
  @api variant;
  @api className;

  /* api: content */

  _contentHtml;
  _contentOriginal;

  @api
  get content() {
    return this._contentOriginal;
  }

  set content(markdown) {
    this._contentOriginal = markdown;

    try {
      this._contentHtml = mdEngine.renderEscaped(markdown);
    } catch (e) {
      this.addError("CO-MD", "Issue when parsing Content markdown");
      if (DEBUG) console.debug(CLASS_NAME, "set content", e);
    }
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("vic2-scope");
  }
}
