declare module "c/sfGpsDsAuNswProgressIndicatorComm" { 
  import type SfGpsDsLwc from "c/sfGpsDsLwc"; 
  import type { Mode } from "c/sfGpsDsAuNswProgressIndicator";

  export default 
  class SfGpsDsAuNswProgressIndicatorComm
  extends SfGpsDsLwc {
    step: number;
    of: number;
    mode?: Mode;
    className?: string;

    // private
  }
}
