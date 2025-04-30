import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { isString, isArray } from "c/sfGpsDsHelpers";

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuVic2ContactUsComm";

export default class extends SfGpsDsLwc {
  @api title;
  @api name;
  @api department;
  @api street;
  @api className;

  /* api: items */

  _items;
  _itemsOriginal;

  @api
  get items() {
    return this._itemsOriginal;
  }

  set items(value) {
    this._itemsOriginal = value;

    if (isString(value)) {
      try {
        value = JSON.parse(value);
      } catch (e) {
        this.addError("CU-JP", "Issue when parsing items JSON value");
        if (DEBUG) console.debug(CLASS_NAME, "set items", e);
      }
    }

    if (isArray(value)) {
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
