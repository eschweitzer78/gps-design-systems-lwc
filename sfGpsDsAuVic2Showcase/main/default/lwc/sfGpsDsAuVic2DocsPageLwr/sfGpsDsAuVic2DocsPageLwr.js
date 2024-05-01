import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";

/**
 * @slot Intro
 * @slot Content
 */
export default class extends SfGpsDsLwc {
  @api title;
  @api description;

  /* api: links */

  _linksOriginal;
  _links = [];

  @api get links() {
    return this._linksOriginal;
  }

  set links(markdown) {
    this._linksOriginal = markdown;

    try {
      this._links = mdEngine.extractLinks(markdown);
    } catch (e) {
      this.addError("LI-MD", "Issue when parsing Links markdown");
      this._links = [];
    }
  }

  /* lifecycle */

  connectedCallback() {
    super._isLwrOnly = true;
    super.connectedCallback();
    this.classList.add("vic2-scope");
  }
}
