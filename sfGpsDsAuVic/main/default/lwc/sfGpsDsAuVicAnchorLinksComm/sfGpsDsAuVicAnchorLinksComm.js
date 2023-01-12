import { api, track } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

export default class SfGpsDsAuVicAnchorLinksComm extends SfGpsDsLwc {
  @api title;

  /* api: links */

  _linksOriginal;
  @track _links;

  @api get links() {
    return this._linksOriginal;
  }

  set links(value) {
    this._linksOriginal = value;

    try {
      this._links = JSON.parse(value);
    } catch (e) {
      this.addError("LI-JS", "Issue when parsing Links JSON");
      this._links = null;
    }
  }

  @api className;
}
