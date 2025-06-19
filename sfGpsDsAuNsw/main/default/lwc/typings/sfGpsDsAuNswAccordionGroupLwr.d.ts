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
    firstChild: boolean;
    showButtons: boolean;
    className: string;

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

    readonly item1closed: boolean;
    readonly item2closed: boolean;
    readonly item3closed: boolean;
    readonly item4closed: boolean;
    readonly item5closed: boolean;
    readonly item6closed: boolean;
    readonly item7closed: boolean;
    readonly item8closed: boolean;
    readonly item9closed: boolean;
    readonly item10closed: boolean;
    readonly item11closed: boolean;
    readonly item12closed: boolean;

    readonly computedIsFullyExpanded: boolean;
    readonly computedIsFullyCollapsed: boolean;
    readonly computedClassName: any;

    handleExpand(event: MouseEvent): void;
    handleCollapse(event: MouseEvent): void;
    handleExpandAll(): void;
    handleCollapseAll(): void;
  }
}
