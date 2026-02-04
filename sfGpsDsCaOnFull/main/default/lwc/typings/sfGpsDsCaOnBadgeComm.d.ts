declare module "c/sfGpsDsCaOnBadgeComm" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";

  export default 
  class SfGpsDsCaOnBadgeComm
  extends SfGpsDsLwc {
    label?: string;
    ariaLabelText?: string;
    colour?: string;
    className?: string;
  }
}
