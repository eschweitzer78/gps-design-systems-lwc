declare module "c/sfGpsDsAuNswTabSetLwr" { 
  import type SfGpsDsTabSetLwr from "c/sfGpsDsTabSetLwr"; 
  import type { PropertyAccessor } from "c/sfGpsDsElement";

  export default 
  class SfGpsDsAuNswTabSetLwr 
  extends SfGpsDsTabSetLwr {
    className?: string;
    firstChild?: boolean;

    // private

    static renderMode: "light" | "shadow";
    _firstChild: PropertyAccessor<boolean>;
    get computedClassName(): any;
  }
}
