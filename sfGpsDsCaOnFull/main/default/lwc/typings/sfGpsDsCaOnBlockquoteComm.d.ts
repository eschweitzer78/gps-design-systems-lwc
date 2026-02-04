declare module "c/sfGpsDsCaOnBlockquoteComm" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";
  import type { PropertyAccessor } from "c/sfGpsDsElement";

  export default 
  class SfGpsDsCaOnBlockquoteComm
  extends SfGpsDsLwc {
    attribution?: string;
    byline?: string;
    className?: string;

    // private

    _quoteHtml: PropertyAccessor<string>;
  }
}
