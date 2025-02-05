import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";

export default class extends SfGpsDsLwc {
  @api type;
  @api heading;
  @api className;

  /* api: body */

  _bodyHtml;
  _bodyOriginal;

  @api
  get body() {
    return this._bodyOriginal;
  }

  set body(markdown) {
    try {
      this._bodyOriginal = markdown;
      this._bodyHtml = markdown ? mdEngine.renderEscaped(markdown) : null;
    } catch (e) {
      this.addError("CO-MD", "Issue when parsing Content markdown");
    }
  }

  /* lifecycle */

  renderedCallback() {
    if (this._bodyOriginal) {
      replaceInnerHtml(this.refs.body, this._bodyHtml);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("qld-scope");
  }
}
