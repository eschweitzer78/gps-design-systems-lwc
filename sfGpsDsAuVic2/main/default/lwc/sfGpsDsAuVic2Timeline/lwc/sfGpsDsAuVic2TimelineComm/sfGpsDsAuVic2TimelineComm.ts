import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { isString } from "c/sfGpsDsHelpers";

const ITEMS_DEFAULT = [];

export default 
class SfGpsDsAuVic2TimelineComm 
extends SfGpsDsLwc {
  // @ts-ignore
  @api 
  title = "";

  /* api: items */

  _items = ITEMS_DEFAULT;
  _itemsOriginal = JSON.stringify(ITEMS_DEFAULT);

  // @ts-ignore
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
  
  // @ts-ignore
  @api 
  className?: string;

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("vic2-scope");
  }
}
