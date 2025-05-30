/*
 * Copyright (c) 2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { LightningElement, api } from "lwc";
import { computeClass, uniqueId } from "c/sfGpsDsHelpers";
import cBasePath from "@salesforce/community/basePath";

const I18N = {
  navAriaLabel: "Menu",
  buttonAriaLabel: "Show or hide menu",
  buttonLabel: "Menu"
};

export default class extends LightningElement {
  static renderMode = "light";

  @api masterbrand;
  @api masterbrandLabel = "GOV.UK";
  @api serviceName;
  @api serviceUrl;
  @api headerUrl;
  @api className;

  /* api: navItems, Array of navigation item objects { url, text, subNav: ... } */

  _navItemsOriginal;
  _navItems;

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
      "govuk-header": true,
      [this.className]: this.className
    };
  }

  _navigationListId;

  get computedNavigationListId() {
    if (this._navigationListId == null) {
      this._navigationListId = uniqueId("sf-gps-ds-uk-gov-header-nav-list");
    }

    return this._navigationListId;
  }

  get computedHeaderUrl() {
    return this.headerUrl || cBasePath || "/";
  }

  get space() {
    return " ";
  }

  get i18n() {
    return I18N;
  }

  /* methods */

  _mapItems;

  mapItems(parentIndex, parentLevel, map, items) {
    let index = 0;
    const docUrl = new URL(document.URL);
    const pathname = docUrl.pathname;

    return items.map((item) => {
      let isActive = item.url === pathname;

      let result = {
        ...item,
        index: item.index || `${parentIndex}-${index++}`,
        level: parentLevel + 1,
        isActive: isActive,
        className: computeClass({
          "govuk-header__navigation-item": true,
          "govuk-header__navigation-item--active": isActive
        })
      };

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

  handleOpenMenu() {
    const openMenuEvent = new CustomEvent("openmenu");
    this.dispatchEvent(openMenuEvent);
  }

  handleLogoClick(event) {
    if (this.headerUrl) {
      return;
    }

    /* if no headerUrl, prevent href navigation and send home nav event */

    event.preventDefault();
    this.dispatchEvent(new CustomEvent("home"));
  }

  handleClick(event) {
    event.preventDefault();

    let index = event.currentTarget.dataset.ndx;
    this.dispatchEvent(new CustomEvent("navigate", { detail: index }));
  }
}
