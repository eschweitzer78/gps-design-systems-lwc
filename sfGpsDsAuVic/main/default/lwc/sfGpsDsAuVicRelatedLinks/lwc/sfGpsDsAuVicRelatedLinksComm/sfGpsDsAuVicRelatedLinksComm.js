import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";

const LINKS_DEFAULT = [];

export default class extends SfGpsDsLwc {
  @api title;
  @api className;

  /* api: links */

  _links = LINKS_DEFAULT;
  _linksOriginal = LINKS_DEFAULT;

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
}
