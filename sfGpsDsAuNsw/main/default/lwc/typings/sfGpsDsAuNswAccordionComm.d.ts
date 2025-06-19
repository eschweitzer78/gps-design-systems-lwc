declare module "c/sfGpsDsAuNswAccordionComm" {
  import SfGpsDsLwc from "c/sfGpsDsLwc";

  export default 
  class SfGpsDsAuNswAccordionComm
  extends SfGpsDsLwc {
    index: string | number;
    header: string;
    content: string;
    className: string;
    
    closed: boolean;

    // private
    _closed: boolean;

    handleExpand(event: MouseEvent): void;
    handleCollapse(event: MouseEvent): void;
  }
}
