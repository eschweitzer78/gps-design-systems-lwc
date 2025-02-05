import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import { isString, isArray } from "c/sfGpsDsHelpers";

const TITLE_DEFAULT = {};

export default class extends SfGpsDsLwc {
  @api ctaTitle;
  @api className;

  /* api: title, string in link markdown format */

  _title = TITLE_DEFAULT;
  _titleOriginal = JSON.stringify(TITLE_DEFAULT);

  @api
  get title() {
    return this._titleOriginal;
  }

  set title(markdown) {
    try {
      this._titleOriginal = markdown;
      this._title = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError("HL-MD", "Issue when parsing Name markdown");
      this._title = TITLE_DEFAULT;
    }
  }

  /* api: items */

  _items;
  _itemsOriginal;

  @api
  get items() {
    return this._itemsOriginal;
  }

  set items(value) {
    this._itemsOriginal = value;

    if (isString(value)) {
      if (value) {
        value = JSON.parse(value);
      } else {
        this._items = null;
        return;
      }
    }

    if (isArray(value)) {
      this._items = value;
    } else if (value) {
      this._items = [value];
    } else {
      this._items = null;
      this.addError(
        "PR-IT",
        "We had an issue parsing JSON for the items property."
      );
    }
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("vic2-scope", "sf-gps-ds-au-vic2-grid");
  }
}
