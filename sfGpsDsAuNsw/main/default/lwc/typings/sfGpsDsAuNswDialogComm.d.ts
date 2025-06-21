declare module "c/sfGpsDsAuNswDialogComm" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";
  import type { PropertyAccessor } from "c/sfGpsDsElement";  
  import type { BStyle } from "c/sfGpsDsAuNswDialog";

  export default 
  class SfGpsDsAuNswDialogComm 
  extends SfGpsDsLwc {
    // title: string;
    primaryButtonText?: string;
    secondaryButtonText?: string;
    bstyle?: BStyle;
    isDismissible: boolean;
    className?: string;

    content?: string;
    
    // private

    _isOpen: boolean;
    _contentHtml: PropertyAccessor<string>;

    readonly computedButtonLabel: string;

    handleClick(event: MouseEvent): void;
    handleDismissed(event: CustomEvent): void;
  }
}
