declare module "c/sfGpsDsAuNswToggletip" { 
  import type SfGpsDsElement from "c/sfGpsDsElement";
 
  export default 
  class SfGpsDsAuNswToggletip 
  extends SfGpsDsElement {
    anchor?: string;

    showToggletip(): void;
    closeToggletip(): void;  
    toggleToggletip(event?: MouseEvent): void;  
    // private

    _isOpen: boolean;

    get computedToggleTipClassName(): any;

    updateToggletip(): void;
  }
}
