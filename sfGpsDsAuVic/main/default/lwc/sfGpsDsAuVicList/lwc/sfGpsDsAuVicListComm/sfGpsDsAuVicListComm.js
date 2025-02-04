import { api } from "lwc";
import { toArray } from "c/sfGpsDsHelpers";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";

const TITLELINK_DEFAULT = {};
const LIST_DEFAULT = [];

export default class extends SfGpsDsLwc {
  @api size; // string
  @api iconColor; // string
  @api className;

  /* api: titleLink, string in link markdown format */

  _titleLink = TITLELINK_DEFAULT;
  _titleLinkOriginal = TITLELINK_DEFAULT;

  @api
  get titleLink() {
    return this._titleLinkOriginal;
  }

  set titleLink(markdown) {
    try {
      this._titleLinkOriginal = markdown;
      this._titleLink = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError("TL-MD", "Issue when parsing TitleLink markdown");
      this._titleLink = TITLELINK_DEFAULT;
    }
  }

  /* api: iconScale string expressing float */

  _iconScale;
  _iconScaleOriginal;

  @api
  get iconScale() {
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

  /* api: list JSON string */

  _list = LIST_DEFAULT;
  _listOriginal = LIST_DEFAULT;

  @api
  get list() {
    return this._listOriginal;
  }

  set list(value) {
    try {
      this._listOriginal = value;
      this._list = toArray(JSON.parse(value));
    } catch (error) {
      this.addError("LI-PE", "Error while JSON parsing list.");
      this._list = LIST_DEFAULT;
    }
  }
}
