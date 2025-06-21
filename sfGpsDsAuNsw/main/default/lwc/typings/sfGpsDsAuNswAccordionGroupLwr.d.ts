declare module "c/sfGpsDsAuNswAccordionGroupLwr" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";

  export interface AccordionGroupItem {
    title: string;
    closed: boolean;
  }

  export default 
  class SfGpsDsAuNswAccordionGroupLwr
  extends SfGpsDsLwc {
    // @ts-ignore
    firstChild?: boolean;
    showButtons?: boolean;
    className?: string;

    item1title: string;
    item2title: string;
    item3title: string;
    item4title: string;
    item5title: string;
    item6title: string;
    item7title: string;
    item8title: string;
    item9title: string;
    item10title: string;
    item11title: string;
    item12title: string;

    // private

    items: AccordionGroupItem[]

    get item1closed(): boolean;
    get item2closed(): boolean;
    get item3closed(): boolean;
    get item4closed(): boolean;
    get item5closed(): boolean;
    get item6closed(): boolean;
    get item7closed(): boolean;
    get item8closed(): boolean;
    get item9closed(): boolean;
    get item10closed(): boolean;
    get item11closed(): boolean;
    get item12closed(): boolean;

    get computedIsFullyExpanded(): boolean;
    get computedIsFullyCollapsed(): boolean;
    get computedClassName(): any;

    handleExpand(event: CustomEvent): void;
    handleCollapse(event: CustomEvent): void;
    handleExpandAll(): void;
    handleCollapseAll(): void;
  }
}
