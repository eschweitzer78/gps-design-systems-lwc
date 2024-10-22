import { LightningElement, api, track } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

export default class extends LightningElement {
  @api title;
  @api url;
  @api className;

  @track _isOpen = false;

  /*
   * api: navItems
   * Array of navigation item objects, format { url: '', text: '', subNav: ... }
   */

  _originalNavItems;
  _navItems;
  _mapItems;

  mapItems(parentIndex, parentLevel, map, items) {
    const currentUrl = document.URL.split("?")[0];
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
        anchorClassName: "qld__sidenav__link",
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
          result.subNav.filter(
            (subNavItem) => subNavItem.isActive || subNavItem.ariaCurrent
          ).length
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

  /* getters */

  get computedClassName() {
    return computeClass({
      "qld__side-nav": true,
      qld__accordion: true,
      js: true,
      [this.className]: this.className
    });
  }

  get computedToggleButtonClassName() {
    return computeClass({
      "qld__side-nav__toggle": true,
      qld__accordion__title: true,
      "qld__accordion--closed": !this._isOpen,
      "qld__accordion--open": this._isOpen
    });
  }

  get computedNavClassName() {
    return computeClass({
      "qld__side-nav__content": true,
      "qld__accordion--closed": !this._isOpen,
      "qld__accordion--open": this._isOpen,
      qld__accordion__body: true
    });
  }

  /* methods */

  navItemsMapping() {
    let map = {};
    this._navItems = this._originalNavItems
      ? this.mapItems("navitem", 0, map, this._originalNavItems)
      : null;
    this._mapItems = map;
  }

  /* events */

  // eslint-disable-next-line no-unused-vars
  handleToggleButtonClick(event) {
    this._isOpen = !this._isOpen;
  }

  handleClickNavigate(event) {
    event.preventDefault();

    let index = event.currentTarget.dataset.ndx;
    this.dispatchEvent(new CustomEvent("navigate", { detail: index }));
  }

  handleClick(event) {
    event.preventDefault();
    this.handleClickNavigate(event);
  }
}
