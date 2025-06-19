declare module "c/sfGpsDsAuNswUpperFooter" {
  import type SfGpsDsElement from "c/sfGpsDsElement";
  import type { Link } from "c/sfGpsDsMarkdown";
  import type { PropertyAccessor } from "c/sfGpsDsElement";
  import type { AdaptedNavigationMenuItem } from "c/sfGpsDsNavigation";

  export type UpperFooterMap = 
    Record<string, AdaptedNavigationMenuItem>;

  export default 
  class SfGpsDsAuNswUpperFooter 
  extends SfGpsDsElement {
    className: string;

    items: AdaptedNavigationMenuItem[];

    // private

    _items: AdaptedNavigationMenuItem[];
    _itemsOriginal: AdaptedNavigationMenuItem[];

    readonly computedClassName: any;
    readonly computedHasItems: boolean;

    _mapItems: UpperFooterMap;

    itemsMapping(): void;
    mapItems(
      parentIndex: string, 
      parentLevel: number, 
      map: UpperFooterMap, 
      items: AdaptedNavigationMenuItem[]
    ): AdaptedNavigationMenuItem[];

    handleClick(event: MouseEvent): void;
  }
}
