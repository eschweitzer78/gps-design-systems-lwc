import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";

const ITEMS_DEFAULT = [];

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuVic2RelatedLinksComm";

export default class extends SfGpsDsLwc {
  @api title = "Related Links";
  @api className;

  /* api: items */

  _items = ITEMS_DEFAULT;
  _itemsOriginal;

  @api
  get items() {
    return this._itemsOriginal;
  }

  set items(markdown) {
    this._itemsOriginal = markdown;

    try {
      this._items = mdEngine.extractLinks(markdown);
    } catch (e) {
      this.addError("IT-MD", "Issue when parsing Links markdown");
      this._items = ITEMS_DEFAULT;
      if (DEBUG) console.debug(CLASS_NAME, "set items", e);
    }
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("vic2-scope");
  }
}
