declare module "c/sfGpsDsAuVic2StandardPageLayoutLwr" {
  import type { LightningElement } from "lwc";

  export default 
  class SfGpsDsAuVic2StandardPageLayoutLwr
  extends LightningElement {
    hasAboveBody: boolean;
    hasSidebar: boolean;
    hasBelowBody: boolean;
    aboveBodyClassName: string;
    bodyClassName: string;
    mainClassName: string;
    sidebarClassName: string;
    belowBodyClassName: string;

    get aboveBodyId(): string;
    get mainId(): string
    get belowBodyId(): string;
    get computedMainClassName(): string;
  }
}