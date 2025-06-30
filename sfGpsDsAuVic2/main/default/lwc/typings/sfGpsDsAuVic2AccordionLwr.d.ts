
declare module "c/sfGpsDsAuVic2AccordionLwr" {
  import type ExpandableStateMixin from "c/sfGpsDsExpandableStateMixin";
  import type SfGpsDsLwc from "c/sfGpsDsLwc";
  import type { PropertyAccessor } from "c/sfGpsDsElement";

  export default 
  class SfGpsDsAuVic2Accordion 
  extends ExpandableStateMixin<SfGpsDsLwc>(
    SfGpsDsLwc
  ) {
    items: Array<{
      title: string,
      className?: string,
      active?: boolean;
    }>;

    set item1Title(value: string);
    get item1Title(): string;
    get item1ClassName(): string;
    get item1Active(): boolean;

    set item2Title(value: string);
    get item2Title(): string;
    get item2ClassName(): string;
    get item2Active(): boolean;

    set item3Title(value: string);
    get item3Title(): string;
    get item3ClassName(): string;
    get item3Active(): boolean;

    set item4Title(value: string);
    get item4Title(): string;
    get item4ClassName(): string;
    get item4Active(): boolean;

    set item5Title(value: string);
    get item5Title(): string;
    get item5ClassName(): string;
    get item5Active(): boolean;

    set item6Title(value: string);
    get item6Title(): string;
    get item6ClassName(): string;
    get item6Active(): boolean;

    set item7Title(value: string);
    get item7Title(): string;
    get item7ClassName(): string;
    get item7Active(): boolean;

    set item8Title(value: string);
    get item8Title(): string;
    get item8ClassName(): string;
    get item8Active(): boolean;

    set item9Title(value: string);
    get item9Title(): string;
    get item9ClassName(): string;
    get item9Active(): boolean;

    set item10Title(value: string);
    get item10Title(): string;
    get item10ClassName(): string;
    get item10Active(): boolean;

    numbered?: boolean;
    className?: string;

    get allExpanded(): boolean;
    get allCollapsed(): boolean;
    
    // toggleAll(): boolean;
    // toggleItemByIndex(index: number): boolean;

      // private

    _numbered: PropertyAccessor<boolean>;

    /* items */

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
    handleToggleItem(event: CustomEvent): void;
  }
}
