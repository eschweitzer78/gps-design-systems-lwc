declare module "c/sfGpsDsAuNswBlockLwr" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";
  import type { PropertyAccessor } from "c/sfGpsDsElement";

  export default 
  class sfGpsDsAuNswBlockLwr 
  extends SfGpsDsLwc {
    className: string;
    firstChild: boolean;

    // private

    _firstChild: PropertyAccessor<boolean>;

    readonly computedClassName: any;
  }
}
