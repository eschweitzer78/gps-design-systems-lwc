declare module "c/sfGpsDsAuNswAlertComm" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";
  import type { PropertyAccessor } from "c/sfGpsDsElement";
  import type { AlertType } from "c/sfGpsDsAuNswAlert";
  
  export default 
  class SfGpsDsAuNswAlertComm 
  extends SfGpsDsLwc {
    title: string;
    as: AlertType;
    compact: boolean;
    content: string;
    className: string;

    // private
    
    _compact: PropertyAccessor<boolean>;
    _contentHtml: string;
    _contentOriginal; string;

    generateContentHtml(): void;
  }
}
