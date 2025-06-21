declare module "c/sfGpsDsAuNswBlockLwr" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";
  import type { PropertyAccessor } from "c/sfGpsDsElement";

  export default 
  class sfGpsDsAuNswBlockLwr 
  extends SfGpsDsLwc {
    className: string;
    // @ts-ignore
    firstChild?: boolean;

    // private

    _firstChild: PropertyAccessor<boolean>;

    get computedClassName(): any;
  }
}
