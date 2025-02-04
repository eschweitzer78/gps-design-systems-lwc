import { api } from "lwc";
import SfGpsDsNavigation from "c/sfGpsDsNavigation";
import { isArray } from "c/sfGpsDsHelpers";

export default class extends SfGpsDsNavigation {
  @api socialLinks;
  @api acknowledgement;
  @api caption;
  @api links;
  @api copyright;
  @api footerLogos;
  @api masterbrand;
  @api className;

  /* getters */

  get computedNav() {
    return this._items && isArray(this._items)
      ? this._items.map((item) => ({
          text: item.text,
          url: item.url,
          children: item.subNav
        }))
      : null;
  }
}
