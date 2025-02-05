import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

export default class extends SfGpsDsLwc {
  @api title;
  @api className;

  /* api: links */

  _links;
  _linksOriginal;

  @api
  get links() {
    return this._linksOriginal;
  }

  set links(value) {
    try {
      this._linksOriginal = value;
      this._links = JSON.parse(value);
    } catch (e) {
      this.addError("LI-JS", "Issue when parsing Links JSON");
      this._links = null;
    }
  }
}
