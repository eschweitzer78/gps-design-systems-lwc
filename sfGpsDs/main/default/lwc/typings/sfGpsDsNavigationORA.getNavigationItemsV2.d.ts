declare module "@salesforce/apex/SfGpsDsNavigationORA.getNavigationItemsV2" {
  type ConnectApiNavigationMenuItemActionType = "Event" | "ExternalLink" | "InternalLink" | "Modal";
  type ConnectApiNavigationMenuItemOpenTarget = "CurrentWindow" | "NewWindow";

  export interface ConnectApiNavigationMenuItem {
    actionType: ConnectApiNavigationMenuItemActionType,
    actionValue: string,
    imageUrl?: string,
    label: string,
    pageReference?: any,
    subMenu?: ConnectApiNavigationMenuItem[],
    target?: ConnectApiNavigationMenuItemOpenTarget
  }

  export interface GetNavigationItemsResp {
    items: ConnectApiNavigationMenuItem[] | ConnectApiNavigationMenuItem, // IPs drop the array when an array is a singleton
    errorMessage: string;
  }
}

