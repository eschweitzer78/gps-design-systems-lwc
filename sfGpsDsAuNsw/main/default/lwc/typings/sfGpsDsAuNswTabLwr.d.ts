declare module "c/sfGpsDsAuNswTabLwr" { 
  import type SfGpsDsTabLwr from "c/sfGpsDsTabLwr"; 
  import type { PropertyAccessor } from "c/sfGpsDsElement";

  export default 
  class SfGpsDsAuNswTabLwr 
  extends SfGpsDsTabLwr {
    disableLazyLoading?: boolean;

    // private

    _disableLazyLoading: PropertyAccessor<boolean>;

    static renderMode: "light" | "shadow"
    get computedClassName(): any;
    get computedLoadContent(): any;
  }
}
