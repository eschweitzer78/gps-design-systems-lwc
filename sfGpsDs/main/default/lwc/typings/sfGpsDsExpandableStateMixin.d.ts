declare module "c/sfGpsDsExpandableStateMixin" {

  interface ExpandableState {
    get items(): any[];
    set items(items: any[]);

    mapItem(
      item: any, 
      index: number, 
      length: number, 
      active: boolean
    ): any;

    getItemById(
      id: string
    ): any;

    isItemExpanded(
      item: any
    ): boolean;

    isItemExpandedById(
      id: string
    ): boolean;

    isItemExpandedByIndex(
      index: number
    ): boolean;

    isAllExpanded(): boolean;
    isAllCollapsed(): boolean;

    toggleItem(
      item: any
    ): boolean | null;

    toggleItemById(
      id: string
    ): boolean | null;

    toggleItemByIndex(
      index: number
    ): boolean | null;

    toggleAll(): boolean;

    // private

    _items: any[];
    _itemsOrigin: any[];
    _nbActiveItems: number;
  }

  export default function ExpandableStateMixin<T extends new (...args: any[]) => object>(
    base: T,
    idAttr?: string, 
    activeAttr?: string, 
    indexAttr?: string
  ): 
    new (...args: any[]) => ExpandableState & T;
}