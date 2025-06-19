declare module "c/sfGpsDsAuNswBackToTopContent" {
  import type SfGpsDsElement, { PropertyAccessor } from "c/sfGpsDsElement";

  export default 
  class sfGpsDsAuNswBackToTop 
  extends LightningElement {
    isActive: boolean;
    isMobile: boolean;
    className: boolean;

    // private
    
    readonly computedClassName: any;

    handleClick(event: MouseEvent): void;
  }
}
