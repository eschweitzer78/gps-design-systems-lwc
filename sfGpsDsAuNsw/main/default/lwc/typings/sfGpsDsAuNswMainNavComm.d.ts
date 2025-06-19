
declare module "c/sfGpsDsAuNswMainNavComm" {
  import type SfGpsDsNavigation from "c/sfGpsDsNavigation";
  import type { Stacking } from "c/sfGpsDsAuNswHeader";

  export default 
  class SfGpsDsAuNswMainNavComm 
  extends SfGpsDsNavigation {
    megaMenu: boolean;
    className: string;
    isActive: boolean;
    mainNavId: string;

    // private

    handleCloseMenu(event: CustomEvent): void;
    handleNavigate(event: CustomEvent): void
  }
}
