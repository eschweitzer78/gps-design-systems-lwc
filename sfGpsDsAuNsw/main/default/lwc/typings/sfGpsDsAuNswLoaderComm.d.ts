declare module "c/sfGpsDsAuNswLoaderComm" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";
  import type { Size } from "c/sfGpsDsAuNswLoader";
  
  export default 
  class SfGpsDsAuNswLoaderComm 
  extends SfGpsDsLwc {
    label?: string;
    className?: string;
    size?: Size;
  }
}
