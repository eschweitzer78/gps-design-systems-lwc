declare module "c/sfGpsDsAuVic2VerticalNav" {
  import type SfGpsDsElement from "c/sfGpsDsElement";
  import type ExpandableStateMixin from "c/sfGpsDsExpandableStateMixin";

  export default 
  class SfGpsDsAuVic2VerticalNav 
  extends ExpandableStateMixin<SfGpsDsElement>(SfGpsDsElement) {
    // title;

    preventDefault?: boolean;
    className?: string;

    // private

    get computedClassName(): any;

    toggleId(itemId: string): string;
    handleToggleMenuItem(event: CustomEvent): void;
    handleItemClick(event: CustomEvent): void;
  }
}