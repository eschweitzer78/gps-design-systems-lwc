declare module "c/sfGpsDsAuNswBackToTopContent" {
  import type SfGpsDsElement from "c/sfGpsDsElement"; 
  import type { PropertyAccessor } from "c/sfGpsDsElement";

  export default 
  class sfGpsDsAuNswBackToTop 
  extends SfGpsDsElement {
    isActive: boolean;
    isMobile: boolean;
    className: boolean;

    // private
    
    readonly computedClassName: any;

    handleClick(event: MouseEvent): void;
  }
}
