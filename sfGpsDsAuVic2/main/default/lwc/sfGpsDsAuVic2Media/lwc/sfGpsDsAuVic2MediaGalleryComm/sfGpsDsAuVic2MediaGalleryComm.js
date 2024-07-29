import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

export default class SfGpsDsAuVic2MediaGalleryComm extends SfGpsDsLwc {
  @api id;
  @api className;

  _itemsOriginal;
  _items;

  @api get items() {
    return this._itemsOriginal;
  }

  set items(value) {
    this._itemsOriginal = value;

    if (typeof value === "string") {
      value = JSON.parse(value);
    }

    if (!Array.isArray(value)) {
      this._items = [];
      return;
    }

    this._items = value;
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("vic2-scope");
  }
}
