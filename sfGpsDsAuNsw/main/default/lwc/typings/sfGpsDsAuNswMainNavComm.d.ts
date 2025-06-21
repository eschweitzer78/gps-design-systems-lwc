
declare module "c/sfGpsDsAuNswMainNavComm" {
  import type SfGpsDsNavigation from "c/sfGpsDsNavigation";

  export default 
  class SfGpsDsAuNswMainNavComm 
  extends SfGpsDsNavigation {
    megaMenu: boolean;
    className?: string;
    isActive: boolean;
    mainNavId?: string;

    // private

    handleCloseMenu(event: CustomEvent): void;
    handleNavigate(event: CustomEvent): void
  }
}
