import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

export default class extends SfGpsDsLwc {
  @api inline;
  @api variant;
  @api className;

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
        try {
          value = JSON.parse(value);
        } catch (e) {
          this._items = null;
          this.addError(
            "DL-IT",
            "We had an issue parsing JSON for the items property."
          );
          return;
        }
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
