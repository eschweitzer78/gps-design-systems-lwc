import { 
  api 
} from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
import mdEngine from "c/sfGpsDsMarkdown";
import { 
  replaceInnerHtml 
} from "c/sfGpsDsHelpers";
import tmpl from "./sfGpsDsMarkdownElement.html";

import type { 
  HtmlSanitizerClass
} from "c/sfGpsDsHelpers";

export default 
class sfGpsDsMarkdownElement
extends SfGpsDsElement {
  // @ts-ignore
  @api 
  className?: string;

  /* api: content */

  _contentOriginal?: string;
  _contentHtml?: string;
  _contentSanitizedHtml?: string;

  // @ts-ignore
  @api
  get content(): string | undefined {
    return this._contentOriginal;
  }

  set content(markdown: string) {
    this._contentOriginal = markdown;
    this._contentHtml = mdEngine.renderEscaped(this._contentOriginal);

    if (this.sanitizer && typeof this.sanitizer.sanitize === "function") {
      this._contentSanitizedHtml = this.sanitizer.sanitize(this._contentHtml);
    } else {
      this._contentSanitizedHtml = this._contentHtml;
    }
  }

  /* computed */

  get sanitizer(): HtmlSanitizerClass | null {
    return null;
  }

  /* lifecycle */

  render() {
    return tmpl;
  }

  renderedCallback() {
    super.renderedCallback?.();
    
    if (this._contentSanitizedHtml) {
      replaceInnerHtml(this.refs.markdown, this._contentSanitizedHtml);
    }
  }
}
