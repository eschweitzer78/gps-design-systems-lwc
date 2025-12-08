declare module "c/sfGpsDsAuNswHeaderV2Comm" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";
  import type { NavigationMixin } from "lightning/navigation";
  import type { RecordRepresentation } from "lightning/uiRecordApi";
  import type { NavigationMode } from "c/sfGpsDsNavigation";

  export type Stacking = import("c/sfGpsDsAuNswHeader").Stacking;
  export type ProfileNavigationMode = Exclude<NavigationMode, "Demo"> | "None";

  export default 
  class sfGpsDsAuNswHeaderV2Comm 
  extends NavigationMixin<SfGpsDsLwc>(SfGpsDsLwc) {
    masterbrand?: string;
    masterbrandAlt?: string;
    srMasterbrandLabel: string;
    logo?: string;
    logoAlt?: string;
    menuLabel: string;
    searchLabel: string;
    siteTitle?: string;
    siteDescriptor?: string;
    headerUrl?: string;
    mobile: boolean;
    mobileLogoStacking: Stacking;
    search: boolean;

    profileMode?: NavigationMode;
    profileIpName?: string;
    profileInputJSON?: string;
    profileOptionsJSON?: string;
    profileNavigationDevName?: string;

    className?: string;

    mainNavId?: string;
    mainNavIsOpen: boolean;

    getUserDetails(options: { 
      error: any, 
      data: RecordRepresentation 
    }): void;

    // private

    userAlias?: string;

    get _isGuest(): boolean;
    get profile(): boolean;

    handleSearch(event: CustomEvent): void;
    handleOpenMenu(event: CustomEvent): void;
    handleHome(event: CustomEvent): void;
  }
}
