declare module "c/sfGpsDsAuNswAccordionGroupComm" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";

  export default 
  class SfGpsDsAuNswAccordionGroupComm
  extends SfGpsDsLwc {
    showButtons: boolean;
    className: string;

    get content(): string | undefined;
    set content(markdown: string);

    // private

    _content: string;
    _contentOriginal: string;
    _numberOpen: number;

    get computedIsFullyExpanded(): boolean;
    get computedIsFullyCollapsed(): boolean;

    handleExpand(event: MouseEvent): void;
    handleCollapse(event: MouseEvent): void;
    handleExpandAll(): void;
    handleCollapseAll(): void;
  }
}
