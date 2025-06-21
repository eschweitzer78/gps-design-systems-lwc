declare module "c/sfGpsDsAuNswBreadcrumbsComm" {
  import { PropertyAccessor } from "c/sfGpsDsElement";
  import type SfGpsDsLwc from "c/sfGpsDsLwc";
  import type { Link } from "c/sfGpsDsMarkdown";
  
  export default 
  class SfGpsDsAuNswBreadcrumbsComm 
  extends SfGpsDsLwc {
    label: string;
    linkComponent: string;
    items: string
    className: string;

    // private

    _items: PropertyAccessor<Link[]>;
  }
}
