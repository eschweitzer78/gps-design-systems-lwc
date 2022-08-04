import { LightningElement, api } from "lwc";

export default class SfGpsDsAuNswSLowerFooter extends LightningElement {
  @api footerAriaLabel = "Global footer secondary menu";

  /*
   * navItems
   * Array of navigation item objects, format { url: '', text: '', subNav: ... }
   */

  _originalNavItems;
  _navItems;
  _mapItems;

  mapItems(parentIndex, parentLevel, map, items) {
    let index = 0;

    return items.map((item) => {
      let result = {
        ...item,
        index: item.index || `${parentIndex}-${index++}`,
        level: parentLevel + 1,
        isActive: false,
        className: ""
      };

      // No subnav supported
      delete result.subNav;

      map[result.index] = result;
      return result;
    });
  }

  @api get navItems() {
    return this._originalNavItems;
  }

  set navItems(items) {
    this._originalNavItems = items;
    this.navItemsMapping();
  }

  navItemsMapping() {
    let map = {};
    this._navItems = this._originalNavItems
      ? this.mapItems("navitem", 0, map, this._originalNavItems)
      : null;
    this._mapItems = map;
  }

  // ----------------

  @api className;

  get computedClassName() {
    return "servicensw-embed" + (this.className ? " " + this.className : "");
  }

  // ----------------

  handleClick(event) {
    event.preventDefault();

    let index = event.currentTarget.dataset.ndx;
    this.dispatchEvent(new CustomEvent("navigate", { detail: index }));
  }
}
