declare module "c/sfGpsDsAuNswInPageNavigationComm" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";
  import type { PropertyAccessor } from "c/sfGpsDsElement";
  import type { Link } from "c/sfGpsDsMarkdown";

  export default 
  class SfGpsDsAuNswInPageNavigationComm 
  extends SfGpsDsLwc {
    //title: string;
    
    // @ts-ignore
    firstChild?: boolean;
    className?: string;
    items?: string;

    // private

    _items: PropertyAccessor<Link[]>;
  }
}
