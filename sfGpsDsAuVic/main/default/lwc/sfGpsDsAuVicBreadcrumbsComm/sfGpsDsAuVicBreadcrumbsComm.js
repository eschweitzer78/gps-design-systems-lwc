import { api, track } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import mdEngine from "c/sfGpsDsMarkdown";
import cBasePath from "@salesforce/community/basePath";

export default class sfGpsDsAuVicBreadcrumbsComm extends SfGpsDsLwc {
  static renderMode = "light";

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

  get mobileCrumbTextLong() {
    const parentText = this._itemsArray[this._itemsArray.length - 2]?.text;
    return parentText || "Home";
  }

  get mobileCrumbTextShort() {
    let parentText = this.mobileCrumbTextLong;

    // Truncate the mobile breadcrumb text if it is longer than 25 characters.
    if (parentText?.length > 25) {
      parentText = parentText.substring(0, 25) + "…";
    }

    return parentText;
  }

  get mobileCrumbUrl() {
    const parentUrl = this._itemsArray[this._itemsArray.length - 2]?.url;
    return parentUrl || cBasePath;
  }
}
