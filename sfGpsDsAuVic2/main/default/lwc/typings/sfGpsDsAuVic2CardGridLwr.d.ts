declare module "c/sfGpsDsAuVic2CardGridLwr" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";
  import type { PropertyAccessor } from "c/sfGpsDsElement";

  export default 
  class SfGpsDsAuVic2CardGridLwr
  extends SfGpsDsLwc {
    hasSideBar?: boolean;
    className?: string;

    // private
    
    _hasSideBar: PropertyAccessor<boolean>;
    _className: PropertyAccessor<string>;
  }
}