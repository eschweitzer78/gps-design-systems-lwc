declare module "c/sfGpsDsAuNswMastheadComm" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";
  import type { PropertyAccessor } from "c/sfGpsDsElement";
  import type { CStyle } from "c/sfGpsDsAuNswMasthead";
  
  export default 
  class SfGpsDsAuNswMastheadComm 
  extends SfGpsDsLwc {
    arLabel: string;
    nav?: string;
    navLabel: string;
    content?: string;
    contentLabel: string;
    cstyle?: CStyle;
    className?: string;

    mastheadLabel?: string;

    // private

    _mastheadLabel: PropertyAccessor<string>;
  }
}
