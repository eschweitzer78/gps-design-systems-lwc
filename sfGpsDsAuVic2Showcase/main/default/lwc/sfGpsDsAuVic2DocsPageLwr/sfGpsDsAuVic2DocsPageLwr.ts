import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import type { Link } from "c/sfGpsDsMarkdown";

const LINKS_DEFAULT: Link[] = [];

/**
 * @slot Intro
 * @slot Content
 */
export default 
class SfGpsDsAuVic2DocsPageLwr 
extends SfGpsDsLwc {
  // @ts-ignore
  @api title: string;
  // @ts-ignore
  @api description: string;

  /* api: links */

  _linksOriginal: string;
  _links: Link[] = LINKS_DEFAULT;

  // @ts-ignore
  @api
  get links(): string {
    return this._linksOriginal;
  }

  set links(markdown: string) {
    try {
      this._linksOriginal = markdown;
      this._links = mdEngine.extractLinks(markdown);
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      this.addError("LI-MD", "Issue when parsing Links markdown");
      this._links = LINKS_DEFAULT;
    }
  }

  /* lifecycle */

  constructor() {
    super(true); // isLwrOnly;
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("vic2-scope");
  }
}
