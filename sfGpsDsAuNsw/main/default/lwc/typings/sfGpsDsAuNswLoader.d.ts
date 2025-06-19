declare module "c/sfGpsDsAuNswLoader" {
  import type SfGpsDsElement, { PropertyAccessor } from "c/sfGpsDsElement";
  import type { Link } from "c/sfGpsDsMarkdown";

  export type Size = 
    "xl" | 
    "lg" | 
    "md" | 
    "sm";
  
  export default 
  class SfGpsDsAuNswLoader 
  extends SfGpsDsElement {
    label: string;
    className: string;
    size: Size;

    // private

    _size: PropertyAccessor<string>;

    readonly computedSpanClassName: any;
    readonly computedClassName: any;
  }
}
