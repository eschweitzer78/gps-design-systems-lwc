import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuQldInPageAlertComm";
/**
 * @slot AlertContent
 */
export default class extends SfGpsDsLwc {
  @api type;
  @api heading;
  @api className;

  /* api: body -- deprecated due to a bug in Exp Builder: attribute named body will not be properly updated */

  @api
  get body() {
    return this.content;
  }

  set body(markdown) {
    // eslint-disable-next-line @lwc/lwc/no-api-reassignments
    this.content = markdown;
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
      this._contentHtml = markdown ? mdEngine.renderEscaped(markdown) : null;
    } catch (e) {
      this.addError("CO-MD", "Issue when parsing Content markdown");
      if (DEBUG) console.debug(CLASS_NAME, "set content", e);
    }
  }

  /* lifecycle */

  renderedCallback() {
    if (this._contentOriginal) {
      replaceInnerHtml(this.refs.content, this._contentHtml);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("qld-scope");
  }
}
