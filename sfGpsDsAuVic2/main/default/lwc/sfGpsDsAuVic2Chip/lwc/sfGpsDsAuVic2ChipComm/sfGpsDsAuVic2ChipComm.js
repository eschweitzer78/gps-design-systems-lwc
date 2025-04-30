import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuVic2ChipComm";

export default class extends SfGpsDsLwc {
  @api variant;
  @api className;

  /* api: links */

  _links;
  _linksOriginal;

  @api
  get links() {
    return this._linksOriginal;
  }

  set links(markdown) {
    try {
      this._linksOriginal = markdown;
      this._links = markdown ? mdEngine.extractLinks(markdown) : null;
    } catch (e) {
      this.addError("LI-MD", "Issue when parsing Links markdown");
      if (DEBUG) console.debug(CLASS_NAME, "set links", e);
    }
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("vic2-scope");
  }
}
