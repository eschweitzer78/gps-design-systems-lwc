declare module "c/sfGpsDsAuNswStatusLabel" { 
  import type SfGpsDsElement from "c/sfGpsDsElement"; 
  import type { PropertyAccessor } from "c/sfGpsDsElement";

  export type Status = 
    "info" |
    "success" |
    "warning" |
    "error";
  
  export default 
  class SfGpsDsAuNswStatusLabel 
  extends SfGpsDsElement {
    label?: string;
    status?: Status;

    // private

    _status: PropertyAccessor<string>;

    get computedClassName(): any;

  }
}
