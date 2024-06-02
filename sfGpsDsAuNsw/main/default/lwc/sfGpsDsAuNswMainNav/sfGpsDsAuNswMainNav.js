/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

// TODO: handle issue with level2 menus on desktop vs mobile -- how do we know when to navigate vs expand?
import { LightningElement, api, track, wire } from "lwc";
import { CurrentPageReference } from "lightning/navigation";
import { computeClass, uniqueId } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuNswMainNav extends LightningElement {
  static renderMode = "light";

  @api mainNavId = "nav"; //uniqueId("sf-gps-ds-au-nsw-main-nav");
  @api navAriaLabel = "Main Navigation";
  @api navTitle = "Menu";
  @api closeMenuLabel = "Close Menu";

  @track _isActivating;
  @track _isClosing;
  _isActive = false;

  @api
  get isActive() {
    return this._isActive;
  }

  set isActive(value) {
    if (value && !this._isActive) {
      this._isActivating = true;
      this._isActive = true;
      this._isActivating = false;
    } else if (!value && this._isActive) {
      this._isClosing = true;
      this._isActive = false;
      this._isClosing = false;
    }
  }

  /*
   * navItems
   * Array of navigation item objects, format { url: '', text: '', subNav: ... }
   */

  _originalNavItems;
  @track _navItems;
  @track _mapItems;

  mapItems(parentIndex, parentLevel, map, items) {
    let index = 0;
    const docUrl = new URL(document.URL);
    const pathname = docUrl.pathname;

    return items.map((item) => {
      const isCurrentPage =
        item.url === pathname ||
        (item.url && pathname.startsWith(item.url + "/"));
      const isActive = isCurrentPage && !parentLevel && !this._megaMenu;

      let result = {
        ...item,
        id: `${parentIndex}-${index}`,
        index: item.index || `${parentIndex}-${index}`,
        level: parentLevel + 1,
        isActive: isActive,
        className: isActive && !this._megaMenu ? "active" : "",
        anchorClassName: isActive && this._megaMenu ? "active" : "",
        subNavAriaLabel: `${item.text} Submenu`,
        subNavClassName: "nsw-main-nav__sub-nav"
      };

      index++;

      if (!this.megaMenu) {
        delete result.subNav;
      } else if (item.subNav) {
        result.subNav = this.mapItems(
          result.index,
          parentLevel + 1,
          map,
          item.subNav
        );
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

  _navItemId = uniqueId("sf-gps-ds-au-nsw-main-nav-item");

  navItemsMapping() {
    let map = {};
    this._navItems = this._originalNavItems
      ? this.mapItems(this._navItemId, 0, map, this._originalNavItems)
      : null;
    this._mapItems = map;
  }

  /* api: megaMenu */

  _megaMenu = false;

  @api get megaMenu() {
    return this._megaMenu;
  }

  set megaMenu(value) {
    this._megaMenu = value;
    this.navItemsMapping();
  }

  /* api: className */

  @api className;

  /* wire: handlePageReference */

  _pageReference;

  @wire(CurrentPageReference) handlePageReference(pageReference) {
    /* This is called when we navigate off the current page... */

    if (this._pageReference && this._pageReference !== pageReference) {
      /* update menu */
      this.navItemsMapping();
    }

    this._pageReference = pageReference;
  }

  /* get: computedClassName */

  get computedClassName() {
    return computeClass({
      "nsw-main-nav": true,
      activating: this.isActivating,
      active: this.isActive,
      closing: this.isClosing,
      [this.className]: this.className
    });
  }

  @api close() {
    // eslint-disable-next-line @lwc/lwc/no-api-reassignments
    this.isActive = false;

    // eslint-disable-next-line guard-for-in
    for (let prop in this._mapItems) {
      let item = this._mapItems[prop];

      item.key = `item-${this.keyIndex++}`;
      item.isActive = false;
      item.className = "";
      item.anchorClassName = "";
      item.subNavClassName = "nsw-main-nav__sub-nav";
    }
    //this._navItems = [...this._navItems];
  }

  getElementForItem(navItem) {
    return navItem?.index
      ? this.querySelector(`[data-ndx="${navItem.index}"]`)
      : null;
  }

  focusItem(navItem) {
    const navItemElt = this.getElementForItem(navItem);
    if (navItemElt) {
      navItemElt.focus();
    }
  }

  /* Active subNavs */

  _activeSubNavs = [];

  pushLatestSubNav(navItem) {
    this._activeSubNavs.push(navItem);
  }

  popLatestSubNav() {
    this._activeSubNavs.pop();
  }

  getLatestSubNav() {
    return this._activeSubNavs.slice(-1);
  }

  /* Event management */

  handleClickNavigate(event) {
    event.preventDefault();

    this.close();

    const closeMenuEvent = new CustomEvent("closemenu");
    this.dispatchEvent(closeMenuEvent);

    let index = event.currentTarget.dataset.ndx;
    this.dispatchEvent(new CustomEvent("navigate", { detail: index }));
  }

  handleClick(event) {
    event.preventDefault();

    // eslint-disable-next-line @lwc/lwc/no-api-reassignments
    this.isActive = true;
    let index = event.currentTarget.dataset.ndx;
    let clickLevel = this._mapItems[index]?.level;

    // eslint-disable-next-line guard-for-in
    for (let prop in this._mapItems) {
      let item = this._mapItems[prop];

      if (prop === index) {
        item.isActive = !item.isActive;
      } else if (item.level === 1 && clickLevel === 1) {
        // if level1 item was clicked, we need to deactivate all other level 1s
        item.isActive = false;
      }

      //item.className = item.isActive ? "active" : "";
      item.className = item.isActive && !this._megaMenu ? "active" : "";
      item.anchorClassName = item.isActive && this._megaMenu ? "active" : "";
      item.subNavClassName = item.isActive
        ? "nsw-main-nav__sub-nav active"
        : "nsw-main-nav__sub-nav";
    }

    this._navItems = [...this._navItems];

    // If there is no subNav to expand, we're really navigating
    // Unless it's level-2 nav on desktop as there is a subNav - it's just not visible and we have to navigate
    if (
      !this._mapItems[index]?.subNav ||
      (clickLevel === 2 && this._isDesktop)
    ) {
      this.handleClickNavigate(event);
    }
  }

  handleMainCloseClick() {
    this.close();

    const closeMenuEvent = new CustomEvent("closemenu");
    this.dispatchEvent(closeMenuEvent);
  }

  handleBackClick(event) {
    this.handleClick(event);
  }

  handleKeydown(event) {
    if (this._megaMenu && event.key === "Escape") {
      //console.log("escape", event.currentTarget.dataset.ndx);
      /*
      const navItem = this.getLatestSubNav();

      if (navItem && navItem.isActive) {
        event.preventDefault();
        navItem.isActive = false;
        navItem.className = "";
        this.focusItem(navItem);
      }
      */
    }
  }

  handleResponsiveCheck(event) {
    this._isDesktop = event?.matches;
  }

  /* Lifecycle */

  breakpoint;
  @track _isDesktop = false;
  _handleResponsiveCheck;

  connectedCallback() {
    this.breakpoint = window.matchMedia("(min-width: 62em");
    this.handleResponsiveCheck(this.breakpoint);

    this._handleResponsiveCheck = this.handleResponsiveCheck.bind(this);
    this.breakpoint?.addEventListener("change", this._handleResponsiveCheck);
  }

  disconnectedCallback() {
    this.breakpoint?.removeEventListener("change", this._handleResponsiveCheck);
  }
}
