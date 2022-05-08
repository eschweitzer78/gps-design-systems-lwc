/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

// TODO: handle issue with level2 menus on desktop vs mobile -- how do we know when to navigate vs expand?
import { LightningElement, api, track } from "lwc";

export default class SfGpsDsAuNswMainNav extends LightningElement {
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
  _navItems;
  _mapItems;

  mapItems(parentIndex, parentLevel, map, items) {
    let index = 0;

    return items.map((item) => {
      let result = {
        ...item,
        index: `${parentIndex}-${index++}`,
        level: parentLevel + 1,
        isActive: false,
        className: "",
        subNavClassName: "nsw-main-nav__sub-nav"
      };

      if (item.subNav) {
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
    let map = {};

    this._originalNavItems = items;
    this._navItems = items ? this.mapItems("navitem", 0, map, items) : null;
    this._mapItems = map;
  }

  @api megaMenu = false;
  @api className;

  get computedClassName() {
    // eslint-disable-next-line prettier/prettier
    return (
      "nsw-main-nav" +
      (this.isActivating ? " activating" : "") +
      (this.isActive ? " active" : "") +
      (this.isClosing ? " closing" : "") +
      // eslint-disable-next-line prettier/prettier
      (this.className ? " " + this.className : "")
    );
  }

  handleClickNavigate(event) {
    event.preventDefault();

    // eslint-disable-next-line @lwc/lwc/no-api-reassignments
    this.isActive = true;

    // TODO implement navigate
    let index = event.currentTarget.dataset.ndx;
    console.log("@@@ navigate to ", index);
  }

  handleClick(event) {
    event.preventDefault();

    // eslint-disable-next-line @lwc/lwc/no-api-reassignments
    this.isActive = true;
    let index = event.currentTarget.dataset.ndx;

    // If there is no subNav to expand, we're really navigating
    if (!this._mapItems[index]?.subNav) {
      this.handleClickNavigate(event);
      return;
    }

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
  }

  handleMainCloseClick() {
    // eslint-disable-next-line @lwc/lwc/no-api-reassignments
    this.isActive = false;

    // eslint-disable-next-line guard-for-in
    for (let prop in this._mapItems) {
      let item = this._mapItems[prop];
      item.isActive = false;
      item.className = "";
      item.subNavClassName = "nsw-main-nav__sub-nav";
    }

    this._navItems = [...this._navItems];

    const closeMenuEvent = new CustomEvent("closemenu");
    this.dispatchEvent(closeMenuEvent);
  }

  handleBackClick(event) {
    this.handleClick(event);
  }
}
