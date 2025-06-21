/*
 * Copyright (c) 2022, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { 
  api, 
  track, 
  wire 
} from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";
import { 
  CurrentPageReference 
} from "lightning/navigation";
import { 
  uniqueId 
} from "c/sfGpsDsHelpers";

import type { 
  AdaptedNavigationMenuItem 
} from "c/sfGpsDsNavigation";
import type { 
  MainNavItem, 
  MainNavItemMap 
} from "c/sfGpsDsAuNswMainNav";

const MEGAMENU_DEFAULT = false;

export default 
class SfGpsDsAuNswMainNav
extends SfGpsDsElement {
  static renderMode: "light" | "shadow" = "light";

  // @ts-ignore
  @api 
  navAriaLabel: string = "Main Navigation";

  // @ts-ignore
  @api 
  navTitle: string = "Menu";

  // @ts-ignore
  @api 
  closeMenuLabel: string = "Close Menu";

  // @ts-ignore
  @api 
  className?: string;

  /* api: mainNavId */

  _mainNavId: string = "nav";

  // @ts-ignore
  @api
  get mainNavId(): string {
    return this._mainNavId;
  }

  set mainNavId(value: string) {
    this._mainNavId = value || "nav";
  }

  /* api: isActive */

  _isActive: boolean = false;
  _isActivating?: boolean;
  _isClosing?: boolean;

  // @ts-ignore
  @api
  get isActive(): boolean {
    return this._isActive;
  }

  set isActive(value: boolean) {
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

  /* api: navItems, array of navigation item objects{ url, text, subNav: ... } */

  // @ts-ignore
  @track 
  _navItems?: MainNavItem[];
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

  // @ts-ignore
  @api
  megaMenu?: boolean;
  _megaMenu = this.defineBooleanProperty("megaMenu", {
    defaultValue: MEGAMENU_DEFAULT,
    watcher: () => { this.navItemsMapping(); }
  });

  /* wire: handlePageReference */

  _pageReference: any;

  // @ts-ignore
  @wire(
    CurrentPageReference
  ) 
  handlePageReference(
    pageReference: any
  ): void {
    /* This is called when we navigate off the current page... */

    if (this._pageReference && this._pageReference !== pageReference) {
      /* update menu */
      this.navItemsMapping();
    }

    this._pageReference = pageReference;
  }

  /* computed */

  get computedClassName(): any {
    return {
      "nsw-main-nav": true,
      activating: this._isActivating,
      active: this.isActive,
      closing: this._isClosing,
      [this.className || ""]: !!this.className
    };
  }

  /* methods */

  _navItemId: string = uniqueId("sf-gps-ds-au-nsw-main-nav-item");

  // @ts-ignore
  @track _mapItems: MainNavItemMap;

  navItemsMapping(): void {
    let map: MainNavItemMap = {};
    this._navItems = this._navItemsOriginal
      ? this.mapItems(this._navItemId, 0, map, this._navItemsOriginal)
      : undefined;
    this._mapItems = map;
  }

  mapItems(
    parentIndex: string, 
    parentLevel: number, 
    map: MainNavItemMap, 
    items: AdaptedNavigationMenuItem[]
  ): MainNavItem[] {
    let index = 0;
    const docUrl = new URL(document.URL);
    const pathname = docUrl.pathname;

    return items.map((item) => {
      const isCurrentPage =
        (item.url === pathname) ||
        (item.url && pathname.startsWith(item.url + "/"));
      const isActive = !!isCurrentPage && !parentLevel && !this._megaMenu;

      let result: MainNavItem = {
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

      if (!this._megaMenu) {
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

  // @ts-ignore
  @api 
  close(): void {
    // eslint-disable-next-line @lwc/lwc/no-api-reassignments
    this.isActive = false;

    // eslint-disable-next-line guard-for-in
    for (let prop in this._mapItems) {
      let item = this._mapItems[prop];

      item.isActive = false;
      item.className = "";
      item.anchorClassName = "";
      item.subNavClassName = "nsw-main-nav__sub-nav";
    }
  }

  getElementForItem(
    navItem: MainNavItem
  ): HTMLElement | null {
    return navItem?.index
      ? this.querySelector(`[data-ndx="${navItem.index}"]`)
      : null;
  }

  focusItem(
    navItem: MainNavItem
  ): void {
    const navItemElt = this.getElementForItem(navItem);

    if (navItemElt) {
      navItemElt.focus();
    }
  }

  /* Active subNavs */

  _activeSubNavs: MainNavItem[] = [];

  pushLatestSubNav(
    navItem: MainNavItem
  ): void {
    this._activeSubNavs.push(navItem);
  }

  popLatestSubNav(): void {
    this._activeSubNavs.pop();
  }

  getLatestSubNav(): MainNavItem {
    return this._activeSubNavs.slice(-1)[0];
  }

  /* event management */

  handleClickNavigate(
    event: MouseEvent
  ): void {
    event.preventDefault();

    this.close();

    const closeMenuEvent = new CustomEvent("closemenu");
    this.dispatchEvent(closeMenuEvent);

    const index = (event.currentTarget as HTMLElement).dataset.ndx;
    this.dispatchEvent(new CustomEvent("navigate", { detail: index }));
  }

  handleClick(
    event: MouseEvent
  ): void {
    event.preventDefault();

    if (!event.currentTarget) return;

    // eslint-disable-next-line @lwc/lwc/no-api-reassignments
    this.isActive = true;
    const index = (event.currentTarget as HTMLElement).dataset.ndx;

    if (index == undefined) return;

    const clickLevel = this._mapItems[index]?.level;

    // eslint-disable-next-line guard-for-in
    for (let prop in this._mapItems) {
      let item = this._mapItems[prop];

      if (prop === index) {
        item.isActive = !item.isActive;
      } else if (item.level === 1 && clickLevel === 1) {
        // if level1 item was clicked, we need to deactivate all other level 1s
        item.isActive = false;
      }

      item.className = item.isActive && !this._megaMenu ? "active" : "";
      item.anchorClassName = item.isActive && this._megaMenu ? "active" : "";
      item.subNavClassName = item.isActive
        ? "nsw-main-nav__sub-nav active"
        : "nsw-main-nav__sub-nav";
    }

    this._navItems = this._navItems 
      ? [...this._navItems] 
      : [];

    // If there is no subNav to expand, we're really navigating
    // Unless it's level-2 nav on desktop as there is a subNav - it's just not visible and we have to navigate
    if (
      !this._mapItems[index]?.subNav ||
      (clickLevel === 2 && this._isDesktop)
    ) {
      this.handleClickNavigate(event);
    }
  }

  // eslint-disable-next-line no-unused-vars
  handleMainCloseClick(
    _event: MouseEvent
  ): void {
    this.close();

    const closeMenuEvent = new CustomEvent("closemenu");
    this.dispatchEvent(closeMenuEvent);
  }

  handleBackClick(
    event: MouseEvent
  ): void {
    this.handleClick(event);
  }

  handleKeydown(
    event: KeyboardEvent
  ): void {
    if (this._megaMenu && event.key === "Escape") {
      const navItem = this.getLatestSubNav();

      if (navItem && navItem.isActive) {
        event.preventDefault();
        navItem.isActive = false;
        navItem.className = "";
        this.focusItem(navItem);
      }
    }
  }

  handleResponsiveCheck(
    event: MediaQueryListEvent
  ): void {
    this._isDesktop = event?.matches;
  }

  /* Lifecycle */

  breakpoint?: MediaQueryList;
  _isDesktop = false;
  _handleResponsiveCheck?: (event: MediaQueryListEvent) => void;

  constructor() {
    super();

    this.handleMounted(() => {
      this.breakpoint = window.matchMedia("(min-width: 62em");

      this._handleResponsiveCheck = this.handleResponsiveCheck.bind(this);
      this.breakpoint?.addEventListener("change", this._handleResponsiveCheck);
    });

    this.handleUnmounted(() => {
      if (this._handleResponsiveCheck) {
        this.breakpoint?.removeEventListener("change", this._handleResponsiveCheck);
      }
    })
  }
}
