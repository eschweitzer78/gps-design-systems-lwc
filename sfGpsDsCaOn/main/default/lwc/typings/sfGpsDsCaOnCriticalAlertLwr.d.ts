declare module "c/sfGpsDsCaOnCritialAlertLwr" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";  
  import type { PropertyAccessor } from "c/sfGpsDsElement";

  export default 
  class SfGpsDsCaOnCriticalAlertLwr
  extends SfGpsDsLwc {
    content?: string;
    className?: string;
  
    // private

    _contentHtml: PropertyAccessor<string>;
  }
}
