declare module "c/sfGpsDsAuNswHeaderProfileIp" {
  import type SfGpsDsNavigation from "c/sfGpsDsNavigation";
  import type SfGpsDsNavigationService from "c/SfGpsDsNavigationService";

  export default 
  class sfGpsDsAuNswHeaderProfileIp 
  extends SfGpsDsNavigation {
    isGuest?: boolean;
    userAlias?: string;
    className?: string;

    // private

    get navSvc(): SfGpsDsNavigationService;

    handleNavigate(event: CustomEvent): void;
    handleLogin(event: CustomEvent): void;
  }
}
