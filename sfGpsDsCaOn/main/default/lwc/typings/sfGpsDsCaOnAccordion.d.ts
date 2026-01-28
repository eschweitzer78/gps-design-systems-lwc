declare module "c/sfGpsDsCaOnAccordion" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";

  export default class SfGpsDsCaOnAccordion extends SfGpsDsLwc {
    static renderMode: string;
    label?: string;
    isOpen?: boolean;
    accordionId?: string;
    className?: string;
  }
}
