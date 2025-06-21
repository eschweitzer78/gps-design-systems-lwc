declare module "c/sfGpsDsMarkdownElement" {
  import type SfGpsDsElement from "c/sfGpsDsElement";
  import type { HtmlSanitizerClass } from "c/sfGpsDsHelpers";

  
  export default class sfGpsDsMarkdownElement extends SfGpsDsElement {
    className?: string;

    get content(): string | undefined;
    set content(markdown: string);

    // internal

    _contentOriginal?: string;
    _contentHtml?: string;
    _contentSanitizedHtml?: string;

    get sanitizer(): HtmlSanitizerClass | null;
  }
}