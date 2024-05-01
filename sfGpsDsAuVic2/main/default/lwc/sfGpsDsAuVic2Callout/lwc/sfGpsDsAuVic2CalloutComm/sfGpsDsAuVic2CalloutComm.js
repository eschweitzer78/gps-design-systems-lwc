import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { replaceInnerHtml, computeClass } from "c/sfGpsDsHelpers";

/**
 * @slot Content
 */
export default class SfGpsDsAuVic2CalloutComm extends SfGpsDsLwc {
  @api title;
  @api variant;
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

  /* getters */

  get computedInlineClassName() {
    return computeClass({
      "inline-callout": true,
      "inline-callout--no-header": !this.title
    });
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("vic2-scope");
  }

  renderedCallback() {
    if (this._contentOriginal) {
      replaceInnerHtml(this.refs.content, this._contentHtml);
    }
  }
}
