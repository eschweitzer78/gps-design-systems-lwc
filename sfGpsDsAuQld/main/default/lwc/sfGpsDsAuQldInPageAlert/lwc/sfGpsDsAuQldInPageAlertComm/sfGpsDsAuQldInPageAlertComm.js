import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";

export default class extends SfGpsDsLwc {
  @api type;
  @api title;
  @api className;

  /* api: copy */

  _copyOriginal;
  _copyHtml;

  @api get copy() {
    return this._copyOriginal;
  }

  set copy(markdown) {
    this._copyOriginal = markdown;
    try {
      if (markdown) {
        this._copyHtml = mdEngine.renderEscaped(markdown);
      } else {
        this._copyHtml = null;
      }
    } catch (e) {
      this.addError("CO-MD", "Issue when parsing Copy markdown");
    }
  }

  /* lifecycle */

  renderedCallback() {
    if (this._copyOriginal) {
      replaceInnerHtml(this.refs.copy, this._copyHtml);
    }

    if (this._footerOriginal) {
      replaceInnerHtml(this.refs.footer, this._footerHtml);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("qld-scope");
  }
}
