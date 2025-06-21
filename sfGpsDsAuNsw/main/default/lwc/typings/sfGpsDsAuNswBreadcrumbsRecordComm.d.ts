declare module "c/sfGpsDsAuNswBreadcrumbsRecordComm" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";
  import type { Link } from "c/sfGpsDsMarkdown"
  import type { PropertyAccessor } from "c/sfGpsDsElement";  
  
  export default 
  class SfGpsDsAuNswBreadcrumbsRecordComm 
  extends SfGpsDsLwc {
    label: string;
    linkComponent: string;
    className: string;
    
    homeLabel: string;
    recordId?: string;
    objectApiName?: string;

    // private

    _homeLabel?: string;
    _recordId: PropertyAccessor<string>;
    _objectApiName: PropertyAccessor<string>;

    _items: Link[];

    updateBreadcrumbs(): void;
  }
}
