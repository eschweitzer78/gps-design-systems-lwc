import { LightningElement, api } from "lwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";
import tmpl from "./sfGpsDsMarkdownElement.html";

export default class extends LightningElement {
  @api className; // string

  /* api: content (string) */

  _contentOriginal;
  _contentHtml;

  @api
  get content() {
    return this._contentOriginal;
  }

  set content(markdown) {
    this._contentOriginal = markdown;
    this._contentHtml = mdEngine.renderEscaped(this._contentOriginal);
  }

  /* lifecycle */

  render() {
    return tmpl;
  }

  renderedCallback() {
    if (this._contentHtml) {
      replaceInnerHtml(this.refs.markdown, this._contentHtml);
    }
  }
}
