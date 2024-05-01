import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";

export default class SfGpsDsAuVic2RelatedLinksComm extends SfGpsDsLwc {
  @api title = "Related Links";
  @api className;

  /* api: items */

  _itemsOriginal;
  _items = [];

  @api get items() {
    return this._itemsOriginal;
  }

  set items(markdown) {
    this._itemsOriginal = markdown;

    try {
      this._items = mdEngine.extractLinks(markdown);
    } catch (e) {
      this.addError("IT-MD", "Issue when parsing Links markdown");
      this._items = [];
    }
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("vic2-scope");
  }
}
