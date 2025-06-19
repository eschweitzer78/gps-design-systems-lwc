declare module "c/sfGpsDsAuNswAccordionGroupHead" {
  import type SfGpsDsElement, { PropertyAccessor } from "c/sfGpsDsElement";

  export default 
  class SfGpsDsAuNswAccordionGroupHead
  extends SfGpsDsElement {
    expandAllLabel: string;
    collapseAllLabel: string;
    showButtons: boolean;
    isFullyExpanded: boolean;
    isFullyCollapsed: boolean;
    className: string;

    // private
    _showButtons: PropertyAccessor<boolean>;
    _isFullyExpanded: PropertyAccessor<boolean>;
    _isFullyCollapsed: PropertyAccessor<boolean>;

    handleExpandAll(event: MouseEvent): void;
    handleCollapsAll(event: MouseEvent): void;
  }
}
