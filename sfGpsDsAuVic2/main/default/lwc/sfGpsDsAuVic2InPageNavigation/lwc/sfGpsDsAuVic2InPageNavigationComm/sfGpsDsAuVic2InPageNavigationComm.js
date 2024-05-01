import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

export default class SfGpsDsAuVic2InPageNavigationComm extends SfGpsDsLwc {
  @api title = "On this page";
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

    //console.log("mapItems", JSON.parse(JSON.stringify(value)));

    if (!Array.isArray(value)) {
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
