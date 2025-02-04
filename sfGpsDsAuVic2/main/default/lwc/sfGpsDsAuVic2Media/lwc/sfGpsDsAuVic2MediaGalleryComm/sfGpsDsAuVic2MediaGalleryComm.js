import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { isString, isArray } from "c/sfGpsDsHelpers";

const ITEMS_DEFAULT = [];

export default class extends SfGpsDsLwc {
  @api id;
  @api className;

  /* items */

  _items = ITEMS_DEFAULT;
  _itemsOriginal = ITEMS_DEFAULT;

  @api
  get items() {
    return this._itemsOriginal;
  }

  set items(value) {
    this._itemsOriginal = value;

    if (isString(value)) {
      value = JSON.parse(value);
    }

    if (!isArray(value)) {
      value = ITEMS_DEFAULT;
    }

    this._items = value;
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("vic2-scope");
  }
}
