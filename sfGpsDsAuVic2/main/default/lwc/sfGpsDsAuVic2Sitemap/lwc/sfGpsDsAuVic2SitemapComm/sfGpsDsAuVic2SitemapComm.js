import { api } from "lwc";
import { isString } from "c/sfGpsDsHelpers";
import SfGpsDsLwc from "c/sfGpsDsLwc";

export default class extends SfGpsDsLwc {
  @api className;

  /* api: items */

  _items;
  _itemsOriginal;

  @api
  get items() {
    return this._itemsOriginal;
  }

  set items(value) {
    if (isString(value)) {
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
