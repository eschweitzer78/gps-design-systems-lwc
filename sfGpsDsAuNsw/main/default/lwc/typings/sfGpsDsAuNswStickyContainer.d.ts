declare module "c/sfGpsDsAuNswStickyContainer" {
  import type SfGpsDsElement from "c/sfGpsDsElement";
  import type OnWindowResize from "c/sfGpsDsOnWindowResize";
  
  export default 
  class SfGpsDsAuNswStickyContainer 
  extends SfGpsDsElement {
    className?: string;

    updateStickyBodyPadding(): void;

    // private

    _onWindowResize: OnWindowResize;
    get computedClassName(): any;

    handleSlotChange(_event: Event): void;

  }
}
