declare module "c/sfGpsDsAuNswAccordionGroupHead" {
  import type SfGpsDsElement from "c/sfGpsDsElement"; 
  import type { PropertyAccessor } from "c/sfGpsDsElement";

  export default 
  class SfGpsDsAuNswAccordionGroupHead
  extends SfGpsDsElement {
    expandAllLabel?: string;
    collapseAllLabel?: string;
    showButtons?: boolean;
    isFullyExpanded?: boolean;
    isFullyCollapsed?: boolean;
    status?: string;

    // private
    _showButtons: PropertyAccessor<boolean>;
    _isFullyExpanded: PropertyAccessor<boolean>;
    _isFullyCollapsed: PropertyAccessor<boolean>;

    get computedExpandAllClassName(): string | null;
    get computedCollapseAllClassName(): string | null

    handleExpandAll(event: MouseEvent): void;
    handleCollapsAll(event: MouseEvent): void;
  }
}
