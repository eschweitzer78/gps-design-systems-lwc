
declare module "c/sfGpsDsAuNswAccordionGroup" {
  import type SfGpsDsElement from "c/sfGpsDsElement"; 
  import type { PropertyAccessor } from "c/sfGpsDsElement";

  export default 
  class SfGpsDsAuNswAccordionGroup
  extends SfGpsDsElement {
    showButtons: boolean;
    isFullyExpanded: boolean;
    isFullyCollapsed: boolean;
    className: string;

    // private

    _showButtons: PropertyAccessor<boolean>;
    _isFullyExpanded: PropertyAccessor<boolean>;
    _isFullyCollapsed: PropertyAccessor<boolean>;

    readonly computedClassName: any;
    readonly i18n: Object;

    handleExpandAll(event: MouseEvent): void;
    handleCollapsAll(event: MouseEvent): void;
  }
}
