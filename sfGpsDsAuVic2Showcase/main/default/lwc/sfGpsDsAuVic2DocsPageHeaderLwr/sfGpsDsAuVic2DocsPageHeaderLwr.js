import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";

const LINKS_DEFAULT = [];

export default class extends SfGpsDsLwc {
  @api title;
  @api description;

  /* api: links */

  _linksOriginal;
  _links = LINKS_DEFAULT;

  @api
  get links() {
    return this._linksOriginal;
  }

  set links(markdown) {
    try {
      this._linksOriginal = markdown;
      this._links = mdEngine.extractLinks(markdown);
    } catch (e) {
      this.addError("LI-MD", "Issue when parsing Links markdown");
      this._links = LINKS_DEFAULT;
    }
  }

  /* computed */

  get computedShowLinks() {
    return this._links?.length;
  }

  /* lifecycle */

  connectedCallback() {
    super._isLwrOnly = true;
    super.connectedCallback();
    this.classList.add("vic2-scope");
  }
}
