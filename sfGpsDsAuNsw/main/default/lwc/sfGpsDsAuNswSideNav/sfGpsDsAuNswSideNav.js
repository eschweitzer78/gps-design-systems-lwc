import { LightningElement, api } from "lwc";
import { computeClass, uniqueId } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuNswSideNav extends LightningElement {
  static renderMode = "light";

  @api title;
  @api url;

  /*
   * navItems
   * Array of navigation item objects, format { url: '', text: '', subNav: ... }
   */

  _originalNavItems;
  _navItems;
  _mapItems;

  mapItems(parentIndex, parentLevel, map, items) {
    const href = window.location.href;
    const currentUrl = href.split("?")[0];
    let index = 0;

    return items.map((item) => {
      let isActive = currentUrl && currentUrl.includes(item.url);
      let isCurrent = currentUrl && currentUrl.endsWith(item.url);

      let result = {
        ...item,
        index: item.index || `${parentIndex}-${index++}`,
        url: item.url || `javascript${":"}void(0)`,
        level: parentLevel + 1,
        isActive: isActive,
        className: isActive ? "active" : null,
        anchorClassName: isCurrent ? "current" : null,
        ariaCurrent: isCurrent ? "page" : null,
        subNav: []
      };

      if (item.subNav) {
        result.subNav = this.mapItems(
          result.index,
          parentLevel + 1,
          map,
          item.subNav
        );

        // Assuming parent label will be hierarchical in exp cloud navs -- which have no attached urls */
        if (
          !item.url &&
          result.subNav.filter((subNavItem) => subNavItem.isActive).length
        ) {
          result.className = "active";
        }
      }

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

  @api className;

  get computedClassName() {
    return computeClass({
      "nsw-side-nav": true,
      [this.className]: this.className
    });
  }

  _labelledById;

  get computedAriaLabelledById() {
    if (!this._labelledById) {
      this._labelledById = uniqueId("sf-gps-ds-au-nsw-side-nav");
    }

    return this._labelledById;
  }

  /* events */

  handleClickNavigate(event) {
    event.preventDefault();

    let index = event.currentTarget.dataset.ndx;
    this.dispatchEvent(new CustomEvent("navigate", { detail: index }));
  }

  handleClick(event) {
    event.preventDefault();

    // eslint-disable-next-line @lwc/lwc/no-api-reassignments
    //this.isActive = true;
    //let index = event.currentTarget.dataset.ndx;

    // If there is no subNav to expand, we're really navigating
    // TODO: sort out level-2 nav on mobile as there is a subNav - it's just not visible
    //if (!this._mapItems[index]?.subNav) {
    this.handleClickNavigate(event);
    //return;
    //}

    /*
    let level1click = this._mapItems[index]?.level === 1;
    // eslint-disable-next-line guard-for-in
    for (let prop in this._mapItems) {
      let item = this._mapItems[prop];

      if (prop === index) {
        item.isActive = !item.isActive;
      } else if (item.level === 1 && level1click) {
        // if level1 item was clicked, we need to deactivate all other level 1s
        item.isActive = false;
      }

      item.className = item.isActive ? "active" : "";
      item.subNavClassName = item.isActive
        ? "nsw-main-nav__sub-nav active"
        : "nsw-main-nav__sub-nav";
    }

    this._navItems = [...this._navItems];
    */
  }
}
