declare module "c/sfGpsDsNavigation" {
  import type { NavigationMixin } from "lightning/navigation";
  import type SfGpsDsIpLwc from "c/sfGpsDsIpLwc";

  import type { 
    ConnectApiNavigationMenuItem
  } from "@salesforce/apex/SfGpsDsNavigationORA.getNavigationItemsV2";

  export type NavigationMode = 
    "Integration Procedure" | 
    "Experience Cloud Navigation" |
    "Demo";

  export type NavigationMenuItemType = 
    "DataSourceDriven" | 
    "Event" | 
    "ExternalLink" | 
    "GlobalAction" |
    "InternalLink" |
    "MenuLabel" |
    "Modal" |
    "NavigationalTopic" |
    "SalesforceObject" |
    "System";

  export type NavigationMenuItemTargetPrefs = 
    "OpenInExternalTab" |
    "OpenExternalLinkInSameTab" |
    "None";

  export type NavigationMenuItemAccessRestriction =  
    "LoginRequired" | 
    "None";

  export type NavigationMenuItemStatus = 
    "DRAFT" | 
    "LIVE";

  export interface NavigationMenuItem {
    Type: NavigationMenuItemType,
    Label: string,
    Position?: number,
    Status?: NavigationMenuItemStatus,
    Target?: string,
    TargetPrefs?: NavigationMenuItemTargetPrefs,
    AccessRestriction?: NavigationMenuItemAccessRestriction,
    DefaultListViewId?: string
  }

  export interface AdaptedNavigationMenuItem {
    item?: Object,
    text?: string,
    url?: string,
    index?: string,
    target?: string,
    position?: number,
    subNav?: AdaptedNavigationMenuItem[]
  }

  type NavigationMenuItemMap = Record<string, NavigationMenuItem>;

  export default 
  class SfGpsDsNavigation 
  extends NavigationMixin<SfGpsDsIpLwc>(SfGpsDsIpLwc) {
    get mode(): NavigationMode;
    set mode(value: NavigationMode);
    
    get navigationDevName(): string | undefined;
    set navigationDevName(value: string | undefined);


    // internal

    _mode: NavigationMode;
    _navigationDevName?: string;
    _map: NavigationMenuItemMap;

    get isEmpty(): boolean;

    updateExperienceCloudNavigation(): void;

    menuReducer(
      data: ConnectApiNavigationMenuItem[], 
      key: string, 
      map: NavigationMenuItemMap, 
      adaptedMap: Record<string, AdaptedNavigationMenuItem> 
    ): AdaptedNavigationMenuItem[];

    mapIpData(
      data: 
        ConnectApiNavigationMenuItem[] |  ConnectApiNavigationMenuItem,
    ): AdaptedNavigationMenuItem[];

    resolveUrl(
      item: NavigationMenuItem
    ): string | undefined;

  }
}