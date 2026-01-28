declare module "c/sfGpsDsCaOnAccordionGroupComm" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";

  export default class SfGpsDsCaOnAccordionGroupComm extends SfGpsDsLwc {
    name?: string;
    accordionData?: string;
    content?: string;
    showExpandCollapse?: boolean;
    expandLabel?: string;
    collapseLabel?: string;
    className?: string;
  }
}
