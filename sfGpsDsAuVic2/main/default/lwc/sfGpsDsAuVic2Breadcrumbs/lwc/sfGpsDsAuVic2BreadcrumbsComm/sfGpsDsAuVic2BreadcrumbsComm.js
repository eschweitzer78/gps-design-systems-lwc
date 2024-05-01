import { api, track } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";

export default class sfGpsDsAuVicBreadcrumbsComm extends SfGpsDsLwc {
  @api className;

  _itemsOriginal;
  @track _items = [];

  @api set items(markdown) {
    this._itemsOriginal = markdown;

    try {
      this._items = mdEngine.extractLinks(markdown);
    } catch (e) {
      this.addError("IT-MD", "Issue when parsing Items markdown");
    }
  }

  get items() {
    return this._itemsOriginal;
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("vic2-scope");
  }
}
