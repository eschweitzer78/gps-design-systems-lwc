import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";

export default class SfGpsDsAuVic2ContactUsComm extends SfGpsDsLwc {
  @api title;
  @api name;
  @api department;
  @api street;
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
      try {
        value = JSON.parse(value);
      } catch (e) {
        this.addError("CU-JP", "Issue when parsing items JSON value");
      }
    }

    if (Array.isArray(value)) {
      this._items = value;
    } else {
      this._items = null;
    }
  }

  /* computed */

  get computedAddress() {
    return {
      name: this.name,
      department: this.department,
      street: this.street
    };
  }
}
