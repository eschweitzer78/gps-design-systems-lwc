import { LightningElement, api } from "lwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { replaceInnerHtml } from "c/sfGpsDsHelpers";
import tmpl from "./sfGpsDsMarkdownElement.html";

export default class SfGpsDsMarkdownElement extends LightningElement {
  _contentOriginal;
  _contentHtml;

  @api get content() {
    return this._contentOriginal;
  }

  set content(markdown) {
    this._contentOriginal = markdown;
    this._contentHtml = mdEngine.renderEscaped(this._contentOriginal);
  }

  @api className;

  render() {
    return tmpl;
  }

  renderedCallback() {
    if (this._contentHtml) {
      replaceInnerHtml(
        this.template.querySelector("[data-markdown]"),
        this._contentHtml
      );
    }
  }
}
