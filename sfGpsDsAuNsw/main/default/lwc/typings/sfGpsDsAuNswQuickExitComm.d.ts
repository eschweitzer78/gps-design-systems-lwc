import { PropertyAccessor } from "c/sfGpsDsElement";

declare module "c/sfGpsDsAuNswQuickExitComm" { 
  import type SfGpsDsLwc from "c/sfGpsDsLwc"; 

  export default 
  class SfGpsDsAuNswQuickExitComm
  extends SfGpsDsLwc {
    safeUrl?: string;
    copy?: string;
    enableEsc?: boolean;
    enableCloak?: boolean;
    focusFirst?: boolean;
    className?: string;

    // private

    _copyHtml: PropertyAccessor<string>;
  }
}
