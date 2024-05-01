import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";

const TITLE_DEFAULT = {};

export default class SfGpsDsAuVic2CardKeyDatesComm extends SfGpsDsLwc {
  @api ctaTitle;
  @api className;

  /* api: title, string in link markdown format */

  _titleOriginal;
  _title = TITLE_DEFAULT;

  @api get title() {
    return this._titleOriginal;
  }

  set title(markdown) {
    this._titleOriginal = markdown;

    try {
      this._title = markdown ? mdEngine.extractFirstLink(markdown) : null;
    } catch (e) {
      this.addError("HL-MD", "Issue when parsing Name markdown");
      this._title = TITLE_DEFAULT;
    }
  }

  /* api: items */

  _itemsOriginal;
  _items;

  @api get items() {
    return this._itemsOriginal;
  }

  set items(value) {
    this._itemsOriginal = value;

    if (typeof value === "string") {
      if (value) {
        value = JSON.parse(value);
      } else {
        this._items = null;
        return;
      }
    }

    if (Array.isArray(value)) {
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
    this.classList.add("vic2-scope");
  }
}
