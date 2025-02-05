import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { parseIso8601 } from "c/sfGpsDsHelpers";

export default class extends SfGpsDsLwc {
  @api title;
  @api summary;
  @api image;
  @api dateStart;
  @api dateEnd;
  @api contentType;
  @api topic;
  @api showMeta = false;
  @api displayStyle;
  @api isGrantOngoing;
  @api inductionYear;
  @api fvRecommendationStatus;
  @api className;

  /* api: link */

  _link;
  _linkOriginal;

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

  /* computed */

  get parsedDateStart() {
    return this.dateStart ? parseIso8601(this.dateStart) : null;
  }

  get parsedDateEnd() {
    return this.dateEnd ? parseIso8601(this.dateEnd) : null;
  }
}
