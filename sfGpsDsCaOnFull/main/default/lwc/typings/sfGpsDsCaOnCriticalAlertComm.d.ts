declare module "c/sfGpsDsCaOnCritialAlertComm" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";  
  import type { PropertyAccessor } from "c/sfGpsDsElement";

  export default 
  class SfGpsDsCaOnCriticalAlertComm
  extends SfGpsDsLwc {
    content?: string;
    className?: string;
  
    // private

    _contentHtml: PropertyAccessor<string>;
  }
}
