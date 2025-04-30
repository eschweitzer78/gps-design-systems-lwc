import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { isString, isArray } from "c/sfGpsDsHelpers";

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuVic2ProfileComm";

export default class extends SfGpsDsLwc {
  @api image;
  @api className;

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
        try {
          value = JSON.parse(value);
        } catch (e) {
          this._items = null;
          this.addError(
            "PR-IT",
            "We had an issue parsing JSON for the items property."
          );
          if (DEBUG) console.debug(CLASS_NAME, "set items", e);
          return;
        }
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
    this.classList.add("vic2-scope");
  }
}
