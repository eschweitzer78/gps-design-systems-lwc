declare module "c/sfGpsDsAuNswLinkListComm" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";
  import type { PropertyAccessor } from "c/sfGpsDsElement";
  import type { Link } from "c/sfGpsDsMarkdown";

  export default 
  class SfGpsDsAuNswLinkListComm 
  extends SfGpsDsLwc {
    // title: string;
    // @ts-ignore
    firstChild?: boolean;
    className?: string;
    links?: string;

    // private

    _links: PropertyAccessor<Link[]>;
  }
}
