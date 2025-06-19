declare module "c/sfGpsDsAuNswHeaderProfile" {
  import type SfGpsDsNavigation from "c/sfGpsDsNavigation";

  export default 
  class sfGpsDsAuNswHeaderProfileIp 
  extends SfGpsDsNavigation {
    isGuest: boolean;
    userAlias: string;
    className: string;

    // private

    readonly navSvc: SfGpsDsNavigationService;

    handleNavigate(event: CustomEvent): void;
    handleLogin(event: CustomEvent): void;
  }
}
