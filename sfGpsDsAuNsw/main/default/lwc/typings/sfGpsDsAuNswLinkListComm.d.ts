declare module "c/sfGpsDsAuNswLinkListComm" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";
  import type { PropertyAccessor } from "c/sfGpsDsElement";
  import type { Link } from "c/sfGpsDsAuNswLinkList";

  export default 
  class SfGpsDsAuNswLinkListComm 
  extends SfGpsDsLwc {
    // title: string;
    highlightExternal?: boolean
    firstChild?: boolean;
    className?: string;
    links?: string;

    // private

    _links: PropertyAccessor<Link[]>;
  }
}
