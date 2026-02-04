declare module "c/sfGpsDsCaOnLinkCardComm" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";

  export default 
  class SfGpsDsCaOnLinkCardComm
  extends SfGpsDsLwc {
    heading?: string;
    description?: string;
    url?: string;
    isExternal?: boolean;
    headingLevel?: string;
    className?: string;
  }
}
