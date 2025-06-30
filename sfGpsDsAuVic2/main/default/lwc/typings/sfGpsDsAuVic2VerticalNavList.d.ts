declare module "c/sfGpsDsAuVic2VerticalNavList" {
  import type SfGpsDsElement from "c/sfGpsDsElement";
  import type { PropertyAccessor } from "c/sfGpsDsElement";
  import type ExpandableStateMixin from "c/sfGpsDsExpandableStateMixin";

  export default 
  class SfGpsDsAuVic2VerticalNavList 
  extends ExpandableStateMixin<SfGpsDsElement>(SfGpsDsElement) {
    level?: number;
    toggleLevels?: boolean;
    isExpanded?: boolean;
    preventDefault?: boolean;
    className?: string;

    // private

    _childLevel: number;
    _level: PropertyAccessor<number>;
    _toggleLevels: PropertyAccessor<number>;
    _tabindex: string;
    _isExpanded: PropertyAccessor<boolean>;
    _preventDefault: PropertyAccessor<boolean>;

    get computedClassName(): any;
    get computedIsExpandable(): boolean;
    get decoratedItems(): any[];

    /* methods */

    mapItem(
      item: any, 
      index: number, 
      length: number, 
      active: boolean
    ): any;

    toggleId(itemId: string): string;
    showIcon(index: number): boolean;

    handleToggle(event: MouseEvent): void;
    handleItemClick(event: CustomEvent): void;
    handleNavListToggle(event: CustomEvent): void;
  }
}