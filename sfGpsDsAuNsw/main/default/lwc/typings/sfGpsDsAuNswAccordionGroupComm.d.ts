declare module "c/sfGpsDsAuNswAccordionGroupComm" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";

  export default 
  class SfGpsDsAuNswAccordionGroupComm
  extends SfGpsDsLwc {
    showButtons: boolean;
    className: string;

    content: string;

    // private

    _content: string;
    _contentOriginal: string;
    _numberOpen: number;

    readonly computedIsFullyExpanded: boolean;
    readonly computedIsFullyCollapsed: boolean;

    handleExpand(event: MouseEvent): void;
    handleCollapse(event: MouseEvent): void;
    handleExpandAll(): void;
    handleCollapseAll(): void;
  }
}
