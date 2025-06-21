declare module "c/sfGpsDsAuNswContainerLwr" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";
  import type { PropertyAccessor } from "c/sfGpsDsElement";

  export type Mode =
    "default" |
    "flush";

  export default 
  class sfGpsDsAuNswContainerLwr
  extends SfGpsDsLwc {
    containerClassName?: string;
    mode?: Mode;

    // private

    _mode: PropertyAccessor<string>;

    get computedContainerClassName(): any;
  }
}