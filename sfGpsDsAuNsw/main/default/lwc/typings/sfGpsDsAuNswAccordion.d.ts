declare module "c/sfGpsDsAuNswAccordion" {
  import type SfGpsDsElement from "c/sfGpsDsElement";
  
  export default 
  class SfGpsDsAuNswAccordion 
  extends SfGpsDsElement {
    index: string | number;
    header: string;
    className: string;
    closed: boolean;

    // private
    
    _isOpen: boolean;

    readonly computedClassName: any;
    readonly computedButtonClassName: any;
    readonly computedIsHidden: boolean;

    _controlsId: string;
    readonly computedAriaControlsId: string;

    handleClick(event: MouseEvent): void;
  }
}
