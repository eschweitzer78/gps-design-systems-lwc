declare module "c/SfGpsDsNavigationService" {
  import type { LightningElement } from "lwc";
  import type { NavigationMenuItem } from "c/sfGpsDsNavigation";
  import type { NavigationMixin } from "lightning/navigation";

  export interface NavigationConfiguration {
    actionName?: string,
    pageName?: string,
    url?: string,
    objectApiName?: string,
    recordId?: string
  }
    
  interface NavigationState {
    filterName?: string
  }

  export default 
  class SfGpsDsNavigationService
  extends NavigationMixin<LightningElement>(LightningElement) {
    navigateTo(
      type: string,
      configuration: NavigationConfiguration,
      state?: NavigationState
    ): void;

    login(): void;
    logout(): void;
    navigateHome(): void;
    
    navigateNavMenu(
      menuEntry: NavigationMenuItem
    ): void;

    generateUrlNavMenu(
      menuEntry: NavigationMenuItem
    ): Promise<string>;

    generateUrl(
      type: string, 
      configuration: NavigationConfiguration,
      state?: NavigationState
    ): Promise<string>;
  }
}