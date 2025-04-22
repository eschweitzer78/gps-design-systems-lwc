import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";

export default class extends SfGpsDsLwc {
  @api besideQuickExit;
  @api collapse;
  @api displayBeforeCollapse;
  @api currentDir;
  @api currentClassName;
  @api className;

  /* api: items */

  _items = [];
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
      this.addError("IT-MD", "Issue when parsing Items markdown");
    }
  }

  /* lifecycle */

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("vic2-scope");
  }
}
