import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

export default class SfGpsDsAuVic2ListComm extends SfGpsDsLwc {
  @api type;
  @api maxDepth;
  @api iconPlacement = "before";
  @api withLinkIds;
  @api itemClassName;
  @api className;

  _itemsOriginal;
  _items;

  @api get items() {
    return this._itemsOriginal;
  }

  set items(value) {
    this._itemsOriginal = value;

    if (typeof value === "string") {
      this._items = JSON.parse(value);
    } else {
      this._items = null;
    }
  }

  get zero() {
    return 0;
  }
}
