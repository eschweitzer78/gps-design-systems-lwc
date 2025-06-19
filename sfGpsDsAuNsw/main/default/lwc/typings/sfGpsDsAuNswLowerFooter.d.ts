declare module "c/sfGpsDsAuNswLowerFooter" {
  import type SfGpsDsElement from "c/sfGpsDsElement";
  import type { AdaptedNavigationMenuItem } from "c/sfGpsDsNavigation";
  import type { PropertyAccessor } from "c/sfGpsDsElement";
 
  export default 
  class SfGpsDsAuNswLowerFooter 
  extends SfGpsDsElement {
    items: AdaptedNavigationMenuItem[];
    statement: string;
    className: string;

    // private

    readonly computedClassName: any;    

    handleClick(event: MouseEvent): void;
  }
}
