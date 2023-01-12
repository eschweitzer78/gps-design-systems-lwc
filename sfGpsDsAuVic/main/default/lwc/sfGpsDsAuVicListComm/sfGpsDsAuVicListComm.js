import { api, track } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";

export default class SfGpsDsAuVicListComm extends SfGpsDsLwc {
  /* api: titleLink, string in link markdown format */

  _titleLinkOriginal;
  @track _titleLink = {};

  @api get titleLink() {
    return this._titleLinkOriginal;
  }

  set titleLink(markdown) {
    this._titleLinkOriginal = markdown;

    try {
      this._titleLink = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError("TL-MD", "Issue when parsing TitleLink markdown");
      this._titleLink = {};
    }
  }

  @api size; // string

  /* api: iconScale string expressing float */

  _iconScaleOriginal;
  @track _iconScale;

  @api get iconScale() {
    return this._iconScaleOriginal;
  }

  set iconScale(value) {
    this._iconScaleOriginal = value;

    if (value !== null) {
      let floatValue = parseFloat(value);

      if (isNaN(floatValue)) {
        this.addError("IS-NAN", "iconScale is not a number.");
        this._iconScale = null;
      } else {
        this._iconScale = floatValue;
      }
    } else {
      this._iconScale = null;
    }
  }

  @api iconColor; // string

  /* api: list JSON string */

  _listOriginal;
  _list;

  @api get list() {
    return this._listOriginal;
  }

  set list(value) {
    this._listOriginal = value;

    try {
      this._list = JSON.parse(value);
    } catch (error) {
      this.addError("LI-PE", "Error while JSON parsing list.");
    }
  }

  @api className;
}
