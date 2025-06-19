declare module "c/sfGpsDsMarkdownElement" {
  import type SfGpsDsElement from "c/sfGpsDsElement";
  
  export default class sfGpsDsMarkdownElement extends SfGpsDsElement {
    content: string;
    className: string;

    // internal

    _contentOriginal: string;
    _contentHtml: string;
    _contentSanitizedHtml: string;

    readonly sanitizer;
  }
}