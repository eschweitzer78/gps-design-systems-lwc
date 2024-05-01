import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

export default class extends SfGpsDsLwc {
  @api className;

  _itemsOriginal;
  _items;

  @api get items() {
    return this._itemsOriginal;
  }

  set items(value) {
    if (typeof value === "string") {
      try {
        value = JSON.parse(value);
      } catch (e) {
        this.addError("IT-SM", "JSON for items is malformed.");
        value = null;
      }
    }

    this._items = value;
  }
}
