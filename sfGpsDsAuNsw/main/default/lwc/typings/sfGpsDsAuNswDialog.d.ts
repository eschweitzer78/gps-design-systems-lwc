declare module "c/sfGpsDsAuNswDialog" {
  import type SfGpsDsElement from "c/sfGpsDsElement"; 
  import type { PropertyAccessor } from "c/sfGpsDsElement";
  
  export type BStyle = "dark" | "danger";

  export default 
  class SfGpsDsAuNswDialog 
  extends SfGpsDsElement {
    // title: string;
    primaryButtonText?: string;
    secondaryButtonText?: string;
    isOpen: boolean;
    className?: string;
    
    bstyle?: BStyle;
    isDismissible?: boolean;

    // private

    _bstyle: PropertyAccessor<string>;
    _isDismissible: PropertyAccessor<boolean>;
    _labelledById?: string;

    get computedClassName(): any;
    get computedPrimaryButtonClassName(): any;
    get computedAriaLabelledById(): string;

    handlePrimaryClick(event: MouseEvent): void;
    handleSecondaryClick(event: MouseEvent): void;
    handleCloseClick(event: MouseEvent): void;
  }
}
