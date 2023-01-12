import { api, track } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { parseIso8601 } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuVicCardNavComm extends SfGpsDsLwc {
  @api title;
  @api summary;
  @api image;
  @api dateStart;
  @api dateEnd;
  @api contentType;
  @api topic;
  @api showMeta = false;
  @api authors;
  @api displayStyle;
  @api isGrantOngoing;
  @api inductionYear;
  @api fvRecommendationStatus;
  @api className;

  /* link */

  _originalLink;
  @track _link;

  @api set link(markdown) {
    this._originalLink = markdown;

    try {
      this._link = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError("HL-MD", "Issue when parsing link markdown.");
    }
  }

  get link() {
    return this._originalLink;
  }

  get parsedDateStart() {
    return this.dateStart ? parseIso8601(this.dateStart) : null;
  }

  get parsedDateEnd() {
    return this.dateEnd ? parseIso8601(this.dateEnd) : null;
  }
}
