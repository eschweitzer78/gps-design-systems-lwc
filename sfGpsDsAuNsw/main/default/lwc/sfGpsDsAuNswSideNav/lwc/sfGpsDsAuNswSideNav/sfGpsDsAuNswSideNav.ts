/*
 * Copyright (c) 2023-2025, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api,
  track 
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
  static renderMode: "light" | "shadow" = "light";

  // @ts-ignore
  @api 
  parentText?: string;

  // @ts-ignore
  @api 
  title = "";

  // @ts-ignore
  @api 
  url?: string;

  // @ts-ignore
  @api 
  className?: string;

  /* api: navItems, array of navigation item objects { url, text, subNav: ... } */

  _navItems?: SideNavMenuItem[];
  _navItemsOriginal?: AdaptedNavigationMenuItem[];

  // @ts-ignore
  @api
  get navItems(): AdaptedNavigationMenuItem[] | undefined {
    return this._navItemsOriginal;
  }

  set navItems(items: AdaptedNavigationMenuItem[]) {
    this._navItemsOriginal = items;
    this.navItemsMapping();
  }

  /* track: isOpen */

  // @ts-ignore
  @track
  _isOpen = false;

  /* computed */

  get computedClassName(): any {
    return {
      "nsw-side-nav": true,
      "open": this._isOpen,
      [this.className || ""]: !!this.className
    };
  }

  _labelledById?: string;

  get computedAriaLabelledById(): string {
    if (!this._labelledById) {
      this._labelledById = uniqueId("nsw-side-nav__header");
    }

    return this._labelledById;
  }

  _controlsId?: string;

  get computedAriaControlsId() {
    if (!this._controlsId) {
      this._controlsId = uniqueId("nsw-side-nav__content");
    }

    return this._controlsId;
  }

  /* methods */

  _mapItems?: SideNavMenuItemMap;

  mapItems(
    parentIndex: string, 
    parentLevel: number, 
    map: SideNavMenuItemMap, 
    items: AdaptedNavigationMenuItem[]
  ): SideNavMenuItem[] {
    const currentUrl = document.URL.split("?")[0];
    let index = 0;

    return items.map((item) => {
      let isActive = 
        !!item.url && 
        !!currentUrl && 
        currentUrl.includes(item.url);
      let isCurrent = 
        !!item.url && 
        !!currentUrl && 
        currentUrl.endsWith(item.url);

      let result: SideNavMenuItem = {
        ...item,
        index: item.index || `${parentIndex}-${index++}`,
        url: item.url || `javascript${":"}void(0)`,
        level: parentLevel + 1,
        isActive: isActive,
        className: isActive ? "active" : undefined,
        anchorClassName: isCurrent ? "current" : undefined,
        ariaCurrent: isCurrent ? "page" : undefined,
        subNav: []
      };

      if (item.subNav) {
        result.subNav = this.mapItems(
          result.index as string,
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

      map[result.index as string] = result;
      return result;
    });
  }

  navItemsMapping(): void {
    let map: SideNavMenuItemMap = {};
    this._navItems = this._navItemsOriginal
      ? this.mapItems("navitem", 0, map, this._navItemsOriginal)
      : undefined;
    this._mapItems = map;
  }

  /* event management */

  handleExpandToggle(
    event: MouseEvent
  ): void {
    event.preventDefault();

    const isDesktop = window.innerWidth > 992
    if (isDesktop) return;

    this._isOpen = !this._isOpen
  };

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
