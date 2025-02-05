import { LightningElement, api } from "lwc";

export default class extends LightningElement {
  @api footerAriaLabel = "Global footer secondary menu";
  @api className;

  /* api: navItems, Array of navigation item objects, format { url, text, subNav: ... } */

  _navItems;
  _navItemsOriginal;

  @api
  get navItems() {
    return this._navItemsOriginal;
  }

  set navItems(items) {
    this._navItemsOriginal = items;
    this.navItemsMapping();
  }

  /* computed */

  get computedClassName() {
    return {
      "servicensw-embed": true,
      [this.className]: this.className
    };
  }

  /* methods */

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

  navItemsMapping() {
    let map = {};
    this._navItems = this._navItemsOriginal
      ? this.mapItems("navitem", 0, map, this._navItemsOriginal)
      : null;
    this._mapItems = map;
  }

  /* event management */

  handleClick(event) {
    event.preventDefault();

    const index = event.currentTarget.dataset.ndx;
    this.dispatchEvent(new CustomEvent("navigate", { detail: index }));
  }
}
