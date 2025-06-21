declare module "c/sfGpsDsAuNswMainNav" {
  import type SfGpsDsElement from "c/sfGpsDsElement"; 
  import type { PropertyAccessor } from "c/sfGpsDsElement";
  import type { AdaptedNavigationMenuItem } from "c/sfGpsDsNavigation";

  export interface MainNavItem {
    id: string,
    index: string,
    level: number,
    isActive: boolean,
    className: string,
    anchorClassName: string,
    subNavAriaLabel: string,
    subNavClassName: string,
    subNav?: MainNavItem[] | AdaptedNavigationMenuItem[]
  }

  export type MainNavItemMap = Record<string, MainNavItem>;

  export default 
  class SfGpsDsAuNswMainNav 
  extends SfGpsDsElement {
    navAriaLabel: string;
    navTitle: string;
    closeMenuLabel: string;
    className: string;
    mainNavId: string;
    isActive: boolean;
    navItems: AdaptedNavigationMenuItem[]; 
    megaMenu: boolean;

    close(): void;

    // private

    _mainNavId: string;

    _isActive: boolean;
    _isActivating: boolean;
    _isClosing: boolean;

    _navItems: MainNavItem[];
    _navItemsOriginal: AdaptedNavigationMenuItem[];

    _megaMenu: PropertyAccessor<boolean>;

    _pageReference: any;
    handlePageReference(pageReference: any): void;

    readonly computedClassName: any;

    _navItemId: string;
    _mapItems: MainNavItemMap;

    navItemsMapping(): void;
    mapItems(
      parentIndex: string, 
      parentLevel: number, 
      map: MainNavItemMap, 
      items: AdaptedNavigationMenuItem[]
    ): MainNavItem[];

    getElementForItem(
      navItem: MainNavItem
    ): HTMLElement | null;
    focusItem(
      navItem: MainNavItem
    ): void;

    _activeSubNavs: MainNavItem[];
    pushLatestSubNav(navItem: MainNavItem): void;
    popLatestSubNav(): void;
    getLatestSubNav(): MainNavItem;

    handleClickNavigate(event: MouseEvent): void;
    handleClick(event: MouseEvent): void;
    handleMainCloseClick(event: MouseEvent): void;
    handleBackClick(event: MouseEvent): void;
    handleKeydown(event: KeyboardEvent): void;
    handleResponsiveCheck(event: MediaQueryList): void;

    breakpoint?: MediaQueryList;
    _isDesktop: boolean;
    _handleResponsiveCheck?: (event: MediaQueryListEvent) => void;
  }
}
