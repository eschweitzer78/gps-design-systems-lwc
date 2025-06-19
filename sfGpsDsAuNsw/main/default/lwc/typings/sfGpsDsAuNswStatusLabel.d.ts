declare module "c/sfGpsDsAuNswStatusLabel" { 
  import type SfGpsDsElement, { PropertyAccessor } from "c/sfGpsDsElement";

  export type Status = 
    "info" |
    "success" |
    "warning" |
    "error";
  
  export default 
  class SfGpsDsAuNswStatusLabel 
  extends SfGpsDsElement {
    label: string;

    status: Status;

    // private

    _status: PropertyAccessor<string>;

    readonly computedClassName: any;

  }
}
