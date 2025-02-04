import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { isString, isArray } from "c/sfGpsDsHelpers";

export default class extends SfGpsDsLwc {
  @api title = "On this page";
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
        this.addError("IT-PA", "JSON for items is malformed.");
      }
    }

    this._items = this.mapItems(value);
  }

  /* methods */

  mapItems(value) {
    if (value == null) {
      return [];
    }

    if (!isArray(value)) {
      this.addError("IT-AR", "JSON for items should be an array.");
      return [];
    }

    return value.map((item, index) => ({
      ...item,
      key: item.key || `item-${index}`,
      items: this.mapItems(item.items)
    }));
  }

  /* event management */

  handleItemClick() {}
}
