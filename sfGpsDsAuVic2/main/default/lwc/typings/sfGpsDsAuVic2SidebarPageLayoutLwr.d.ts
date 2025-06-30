declare module "c/sfGpsDsAuVic2SidebarPageLayoutLwr" {
  import type { LightningElement } from "lwc";
  
  export default 
  class SfGpsDsAuVic2SidebarPageLayoutLwr 
  extends LightningElement {
    aboveBodyClassName: string;
    bodyClassName: string;
    mainClassName: string;
    sidebarClassName: string;
    belowBodyClassName: string;

    get hasSidebar(): boolean;
    set hasSidebar(value: boolean);

    // private

    _hasSidebar: boolean;

    get aboveBodyId(): string;
    get mainId(): string;
    get belowBodyId(): string;
    get computedMainClassName(): any;
  }
}