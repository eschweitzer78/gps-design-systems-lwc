import { api, track } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";

export default class sfGpsDsAuVicBreadcrumbsComm extends SfGpsDsLwc {
  @api label = "Breadcrumbs";
  @api className;

  _items;
  @track _itemsArray = [];

  @api set items(markdown) {
    this._items = markdown;
    try {
      let itemsArray = mdEngine.extractLinks(markdown);
      this._itemsArray = itemsArray.map((item, index) => ({
        ...item,
        isLast: index === itemsArray.length - 1
      }));
    } catch (e) {
      this.addError("IT-MD", "Issue when parsing Items markdown");
    }
  }

  get items() {
    return this._items;
  }
}
