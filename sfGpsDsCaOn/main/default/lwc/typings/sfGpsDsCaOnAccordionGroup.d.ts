declare module "c/sfGpsDsCaOnAccordionGroup" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";

  export interface AccordionItem {
    id: string;
    label: string;
    content: string;
    contentType?: "string" | "html";
    isOpen?: boolean;
    ariaLabelText?: string;
  }

  export default class SfGpsDsCaOnAccordionGroup extends SfGpsDsLwc {
    static renderMode: string;
    name?: string;
    showExpandCollapse?: boolean;
    expandLabel?: string;
    collapseLabel?: string;
    className?: string;
    items: AccordionItem[] | string;
  }
}
