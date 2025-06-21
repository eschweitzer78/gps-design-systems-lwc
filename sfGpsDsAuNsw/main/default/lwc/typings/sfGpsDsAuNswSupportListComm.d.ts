declare module "c/sfGpsDsAuNswSupportListComm" { 
  import type SfGpsDsLwc from "c/sfGpsDsLwc"; 
  import type { PropertyAccessor } from "c/sfGpsDsElement";
  import type { Link } from "c/sfGpsDsMarkdown";
 
  export type LogoPosition =
    "none" |
    "labels" |
    "logos";

  export default 
  class SfGpsDsAuNswSupportListComm 
  extends SfGpsDsLwc {
    header: string;
    logoPosition: LogoPosition;
    className?: string;

    departments?: string;
    supportLogos?: string;

    // private

    _departments: PropertyAccessor<Link[]>;
    _supportLogos: PropertyAccessor<Link[]>;
  }
}
