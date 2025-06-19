
declare module "c/sfGpsDsAuNswSideNav" { 
  import type SfGpsDsElement, { PropertyAccessor } from "c/sfGpsDsElement";
  import type { AdaptedNavigationMenuItem } from "c/sfGpsDsNavigation";

  export interface SideNavMenuItem 
  extends AdaptedNavigationMenuItem {
    level: number,
    isActive: boolean,
    className: string,
    anchorClassName: string,
    ariaCurrent: string,
    subNav: SideNavMenuItem[]
  }

  export type SideNavMenuItemMap = { [key: string]: SideNavMenuItem };

  export default 
  class SfGpsDsAuNswSideNav
  extends SfGpsDsElement {
    title: string;
    url: string;
    className: string;

    navItems: AdaptedNavigationMenuItem[];

    // private

    _navItems: AdaptedNavigationMenuItem[];
    _navItemsOriginal: AdaptedNavigationMenuItem[];

    readonly computedClassName: any;

    _labelledById: string;
    readonly computedAriaLabelledById: string;

    _mapItems: SideNavMenuItemMap;

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
