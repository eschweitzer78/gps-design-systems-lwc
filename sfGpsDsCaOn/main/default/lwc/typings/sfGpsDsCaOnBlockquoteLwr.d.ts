declare module "c/sfGpsDsCaOnBlockquoteLwr" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";
  import type { PropertyAccessor } from "c/sfGpsDsElement";

  export default 
  class SfGpsDsCaOnBlockquoteLwr
  extends SfGpsDsLwc {
    attribution?: string;
    byline?: string;
    className?: string;

    // private

    _quoteHtml: PropertyAccessor<string>;
  }
}
