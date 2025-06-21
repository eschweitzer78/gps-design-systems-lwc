
declare module "c/sfGpsDsAuNswSideNav" { 
  import type SfGpsDsElement from "c/sfGpsDsElement"; 
  import type { AdaptedNavigationMenuItem } from "c/sfGpsDsNavigation";

  export interface SideNavMenuItem 
  extends AdaptedNavigationMenuItem {
    level: number,
    isActive: boolean,
    className?: string,
    anchorClassName?: string,
    ariaCurrent?: string,
    subNav: SideNavMenuItem[]
  }

  export type SideNavMenuItemMap = Record<string,  SideNavMenuItem>;

  export default 
  class SfGpsDsAuNswSideNav
  extends SfGpsDsElement {
    //title: string;
    url?: string;
    className?: string;

    get navItems(): AdaptedNavigationMenuItem[] | undefined;
    set navItems(items: AdaptedNavigationMenuItem[]);

    // private

    _navItems?: AdaptedNavigationMenuItem[];
    _navItemsOriginal?: AdaptedNavigationMenuItem[];

    get computedClassName(): any;

    _labelledById?: string;
    get computedAriaLabelledById(): string;

    _mapItems?: SideNavMenuItemMap;

    mapItems(
      parentIndex: string, 
      parentLevel: number, 
      map: SideNavMenuItemMap, 
      items: AdaptedNavigationMenuItem[]
    ): SideNavMenuItem[];

    navItemsMapping(): void;

    handleClickNavigate(event: MouseEvent): void;
    handleClick(event: MouseEvent): void;
  }
}
