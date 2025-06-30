declare module "c/sfGpsDsAuVic2Accordion" {
  import type SfGpsDsElement from "c/sfGpsDsElement";
  import type { PropertyAccessor } from "c/sfGpsDsElement";
  import type ExpandableStateMixin from "c/sfGpsDsExpandableStateMixin";

  export default 
  class SfGpsDsAuVic2Accordion 
  extends ExpandableStateMixin<SfGpsDsElement>(
    SfGpsDsElement
  ) {
    numbered?: boolean;
    className?: string;

    get allExpanded(): boolean;
    get allCollapsed(): boolean;

    // private;

    _numbered: PropertyAccessor<boolean>;

    mapItem(
      item: any, 
      index: number, 
      _length: number, 
      active: boolean
    ): any;

    get computedClassName(): any;
    get computedToggleAllLabel(): string;
    get computedShowButton(): boolean;

    handleToggleAll(): void;
    handleToggleItem(event: MouseEvent): void;
  }
}