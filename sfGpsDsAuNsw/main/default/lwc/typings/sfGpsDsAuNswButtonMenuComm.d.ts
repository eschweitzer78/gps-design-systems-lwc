declare module "c/sfGpsDsAuNswButtonMenuComm" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";
  import type { PropertyAccessor } from "c/sfGpsDsElement";
  import type { Link } from "c/sfGpsDsMarkdown";

  export default 
  class SfGpsDsAuNswButtonMenuComm 
  extends SfGpsDsLwc {
    label?: string;
    iconName?: string;
    menuPosition?: string;
    links?: string;
    className?: string;

    // private

    _links: PropertyAccessor<Link[]>;
  }
}
