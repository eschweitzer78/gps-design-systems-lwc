declare module "c/sfGpsDsFocusTrap" {

  import type SfGpsDsElement from "c/sfGpsDsElement";
  import type { PropertyAccessor } from "c/sfGpsDsElement";

  export interface FocusTrapOptions {
  }

  export default 
  class SfGpsDsFocusTrap 
  extends SfGpsDsElement {
    // public

    disabled?: boolean;
    options: FocusTrapOptions;

    // private

    _disabled: PropertyAccessor<boolean>;
  }
}