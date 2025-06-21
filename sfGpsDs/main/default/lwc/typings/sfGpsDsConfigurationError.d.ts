declare module "c/sfGpsDsConfigurationError" {
  import type { LightningElement } from "lwc";
  import type { LwcError } from "c/sfGpsDsElement";

  export default 
  class SfGpsDsConfigurationError 
  extends LightningElement {
    errors?: LwcError[];
  }
}