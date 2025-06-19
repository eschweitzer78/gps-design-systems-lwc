declare module "c/sfGpsDsAuNswBreadcrumbsComm" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";
  import type { Link } from "c/sfGpsDsMarkdown";
  
  export default 
  class sfGpsDsAuNswBreadcrumbsComm 
  extends SfGpsDsLwc {
    label: string;
    linkComponent: string;
    items: string
    className: string;

    // private

    _items: Link[];
  }
}
