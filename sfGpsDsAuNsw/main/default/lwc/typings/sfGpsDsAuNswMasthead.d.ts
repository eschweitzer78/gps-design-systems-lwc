declare module "c/sfGpsDsAuNswMasthead" {
  import type SfGpsDsElement from "c/sfGpsDsElement"
  import type { PropertyAccessor } from "c/sfGpsDsElement";

  export type CStyle = "default" | "light";
  
  export default 
  class SfGpsDsAuNswLoader 
  extends SfGpsDsElement {
    arLabel: string;
    navLabel: string;
    contentLabel: string;
    content?: string;
    nav?: string;
    className?: string;

    cstyle?: CStyle;

    // private

    _cstyle: PropertyAccessor<CStyle>;

    get computedSkipClassName(): any;
    get computedMastheadClassName(): any;
  }
}
