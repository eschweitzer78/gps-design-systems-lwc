/*
 * Copyright (c) 2023-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api 
} from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
import { 
  uniqueId 
} from "c/sfGpsDsHelpers";

import type { 
  AdaptedNavigationMenuItem 
} from "c/sfGpsDsNavigation";
import type { 
  SideNavMenuItem,
  SideNavMenuItemMap
 } from "c/sfGpsDsAuNswSideNav";


export default 
class SfGpsDsAuNswSideNav
extends SfGpsDsElement {
  static renderMode = "light";

  // @ts-ignore
  @api 
  title = "";

  // @ts-ignore
  @api 
  url: string;

  // @ts-ignore
  @api 
  className: string;

  /* api: navItems, array of navigation item objects { url, text, subNav: ... } */

  _navItems: SideNavMenuItem[];
  _navItemsOriginal: AdaptedNavigationMenuItem[];

  // @ts-ignore
  @api
  get navItems(): AdaptedNavigationMenuItem[] {
    return this._navItemsOriginal;
  }

  set navItems(items: AdaptedNavigationMenuItem[]) {
    this._navItemsOriginal = items;
    this.navItemsMapping();
  }

  /* computed */

  get computedClassName(): any {
    return {
      "nsw-side-nav": true,
      [this.className]: !!this.className
    };
  }

  _labelledById: string;

  get computedAriaLabelledById(): string {
    if (!this._labelledById) {
      this._labelledById = uniqueId("sf-gps-ds-au-nsw-side-nav");
    }

    return this._labelledById;
  }

  /* methods */

  _mapItems: SideNavMenuItemMap;

  mapItems(
    parentIndex: string, 
    parentLevel: number, 
    map: SideNavMenuItemMap, 
    items: AdaptedNavigationMenuItem[]
  ): SideNavMenuItem[] {
    const currentUrl = document.URL.split("?")[0];
    let index = 0;

    return items.map((item) => {
      let isActive = currentUrl && currentUrl.includes(item.url);
      let isCurrent = currentUrl && currentUrl.endsWith(item.url);

      let result: SideNavMenuItem = {
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

  navItemsMapping(): void {
    let map: SideNavMenuItemMap = {};
    this._navItems = this._navItemsOriginal
      ? this.mapItems("navitem", 0, map, this._navItemsOriginal)
      : null;
    this._mapItems = map;
  }

  /* event management */

  handleClickNavigate(
    event: MouseEvent
  ): void {
    event.preventDefault();

    const index = (event.currentTarget as HTMLElement).dataset.ndx;
    this.dispatchEvent(new CustomEvent("navigate", { detail: index }));
  }

  handleClick(
    event: MouseEvent
  ): void {
    event.preventDefault();
    this.handleClickNavigate(event);
  }
}
