declare module "c/sfGpsDsCaOnPageAlertLwr" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";  
  import type { PropertyAccessor } from "c/sfGpsDsElement";

  export default 
  class SfGpsDsCaOnPageAlertLwr
  extends SfGpsDsLwc {
    content?: string;
    heading?: string;
    type?: string;
    className?: string;
  
    // private

    _contentHtml: PropertyAccessor<string>;
  }
}
