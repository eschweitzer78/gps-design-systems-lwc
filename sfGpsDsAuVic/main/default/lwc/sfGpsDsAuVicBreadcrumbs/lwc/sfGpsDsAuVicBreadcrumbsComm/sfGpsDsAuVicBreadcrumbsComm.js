import { api } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import cBasePath from "@salesforce/community/basePath";

export default class extends SfGpsDsLwc {
  static renderMode = "light";

  @api label = "Breadcrumbs";
  @api className;

  /* api: items */

  _items = [];
  _itemsOriginal;

  @api
  get items() {
    return this._itemsOriginal;
  }

  set items(markdown) {
    try {
      this._itemsOriginal = markdown;
      const itemsArray = mdEngine.extractLinks(markdown);
      this._items = itemsArray.map((item, index) => ({
        ...item,
        isLast: index === itemsArray.length - 1
      }));
    } catch (e) {
      this.addError("IT-MD", "Issue when parsing Items markdown");
    }
  }

  /* computed */

  get computedMobileCrumbTextLong() {
    return this._items[this._items.length - 2]?.text || "Home";
  }

  get computedMobileCrumbTextShort() {
    const parentText = this.computedMobileCrumbTextLong;

    // Truncate the mobile breadcrumb text if it is longer than 25 characters.
    return parentText?.length > 25
      ? parentText.substring(0, 25) + "…"
      : parentText;
  }

  get computedMobileCrumbUrl() {
    const parentUrl = this._items[this._items.length - 2]?.url;
    return parentUrl || cBasePath;
  }
}
