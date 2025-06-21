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
    className?: string;

    get items(): AdaptedNavigationMenuItem[] | undefined;
    set items(items: AdaptedNavigationMenuItem[]);

    // private

    _items?: AdaptedNavigationMenuItem[];
    _itemsOriginal?: AdaptedNavigationMenuItem[];

    get computedClassName(): any;
    get computedHasItems(): boolean;

    _mapItems?: UpperFooterMap;

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
