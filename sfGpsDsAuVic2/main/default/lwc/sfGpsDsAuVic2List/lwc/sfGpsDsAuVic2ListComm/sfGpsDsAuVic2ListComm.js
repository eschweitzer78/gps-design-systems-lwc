import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { isString } from "c/sfGpsDsHelpers";

const ITEMS_DEFAULT = null;

export default class extends SfGpsDsLwc {
  @api type;
  @api maxDepth;
  @api iconPlacement = "before";
  @api withLinkIds;
  @api itemClassName;
  @api className;

  /* api: items */

  _items = ITEMS_DEFAULT;
  _itemsOriginal = ITEMS_DEFAULT;

  @api
  get items() {
    return this._itemsOriginal;
  }

  set items(value) {
    this._itemsOriginal = value;

    if (isString(value)) {
      this._items = JSON.parse(value);
    } else {
      this._items = ITEMS_DEFAULT;
    }
  }

  get zero() {
    return 0;
  }
}
