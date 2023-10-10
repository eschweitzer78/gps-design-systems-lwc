import { api } from "lwc";
import SfGpsDsNavigation from "c/sfGpsDsNavigation";

export default class SfGpsDsAuVicSiteFooterInternal extends SfGpsDsNavigation {
  @api socialLinks;
  @api acknowledgement;
  @api caption;
  @api links;
  @api copyright;
  @api footerLogos;
  @api masterbrand;
  @api className;

  // SfGpsDsNavigation
  // At this level it's for the nav

  @api
  get ipName() {
    return super.ipName;
  }

  set ipName(value) {
    super.ipName = value;
  }

  @api
  get inputJSON() {
    return super.inputJSON;
  }

  set inputJSON(value) {
    super.inputJSON = value;
  }

  @api
  get optionsJSON() {
    return super.optionsJSON;
  }

  set optionsJSON(value) {
    super.optionsJSON = value;
  }

  get _nav() {
    return this._items && Array.isArray(this._items)
      ? this._items.map((item) => ({
          text: item.text,
          url: item.url,
          children: item.subNav
        }))
      : null;
  }
}
