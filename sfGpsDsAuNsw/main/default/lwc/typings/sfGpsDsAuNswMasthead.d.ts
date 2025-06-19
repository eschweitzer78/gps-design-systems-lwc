declare module "c/sfGpsDsAuNswMasthead" {
  import type SfGpsDsElement, { PropertyAccessor } from "c/sfGpsDsElement";
  import type { Link } from "c/sfGpsDsMarkdown";


  export type CStyle = "default" | "light";
  
  export default 
  class SfGpsDsAuNswLoader 
  extends SfGpsDsElement {
    label: string;
    navLabel: string;
    contentLabel: string;
    nav: string;
    className: string;

    cstyle: CStyle;

    // private

    _cstyle: PropertyAccessor<CStyle>;

    readonly computedSkipClassName: any;
    readonly computedMastheadClassName: any;
  }
}
