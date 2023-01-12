import { api, track } from "lwc";
import mdEngine from "c/sfGpsDsMarkdown";
import SfGpsDsLwc from "c/sfGpsDsLwc";

export default class SfGpsDsAuVicCardEmergencyContactComm extends SfGpsDsLwc {
  @api title;
  @api subtitle;
  @api summary;
  @api className;

  /* link */

  _originalLink;
  @track _link;

  @api get link() {
    return this._originalLink;
  }

  set link(markdown) {
    this._originalLink = markdown;

    try {
      this._link = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError("HL-MD", "Issue when parsing link markdown.");
    }
  }
}
