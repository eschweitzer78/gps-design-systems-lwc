declare module "c/sfGpsDsAuNswUtilityListComm" { 
  import type SfGpsDsLwc from "c/sfGpsDsLwc"; 
  import type { SocialSharingInfo } from "c/sfGpsDsAuNswUtilityList";
 
  export type ListOrientation = "vertical" | "horizontal";
  
  export default 
  class SfGpsDsAuNswUtilityListComm
  extends SfGpsDsLwc {
    printLabel?: string;
    copyLabel?: string;
    shareLabel?: string;
    shareUrl?: string;
    className?: string;

    get shareConfig(): string;
    set shareConfig(value: string);

    orientation: ListOrientation;

    // private

    _shareConfigOriginal: string;
    _shareConfig: SocialSharingInfo[];

    get computedShareUrl(): string;
  }
}
