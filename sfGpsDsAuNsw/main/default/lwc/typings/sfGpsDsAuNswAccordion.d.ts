declare module "c/sfGpsDsAuNswAccordion" {
  import type SfGpsDsElement from "c/sfGpsDsElement";
  
  export default 
  class SfGpsDsAuNswAccordion 
  extends SfGpsDsElement {
    index?: string | number;
    header?: string;
    className?: string;
    closed: boolean;

    // private
    
    _isOpen: boolean;

    get computedClassName(): any;
    get computedButtonClassName(): any;
    get computedIsHidden(): string | null;

    _controlsId?: string;
    get computedAriaControlsId(): string;

    handleClick(event: MouseEvent): void;
  }
}
