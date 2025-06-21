declare module "c/sfGpsDsAuNswLoader" {
  import type SfGpsDsElement from "c/sfGpsDsElement"; 
  import type { PropertyAccessor } from "c/sfGpsDsElement";

  export type Size = 
    "xl" | 
    "lg" | 
    "md" | 
    "sm";
  
  export default 
  class SfGpsDsAuNswLoader 
  extends SfGpsDsElement {
    label?: string;
    className?: string;
    size?: Size;

    // private

    _size: PropertyAccessor<string>;

    get computedSpanClassName(): any;
    get computedClassName(): any;
  }
}
