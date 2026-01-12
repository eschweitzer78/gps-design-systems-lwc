declare module "c/sfGpsDsCaOnPageAlertComm" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";  
  import type { PropertyAccessor } from "c/sfGpsDsElement";

  export default 
  class SfGpsDsCaOnPageAlertComm
  extends SfGpsDsLwc {
    content?: string;
    heading?: string;
    type?: string;
    className?: string;
  
    // private

    _contentHtml: PropertyAccessor<string>;
  }
}
