import { api } from "lwc";
import mdEngine from "c/sfGpsDsMarkdown";
import SfGpsDsLwc from "c/sfGpsDsLwc";

export default class extends SfGpsDsLwc {
  @api title;
  @api subtitle;
  @api summary;
  @api className;

  /* api: link */

  _linkOriginal;
  _link;

  @api
  get link() {
    return this._linkOriginal;
  }

  set link(markdown) {
    try {
      this._linkOriginal = markdown;
      this._link = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError("HL-MD", "Issue when parsing link markdown.");
    }
  }
}
