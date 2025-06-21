declare module "c/sfGpsDsAuNswHeaderComm" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";
  import type { NavigationMixin } from "lightning/navigation";
  import type { Stacking } from "c/sfGpsDsAuNswHeader";
  import type { RecordRepresentation } from "lightning/uiRecordApi";

  export default 
  class sfGpsDsAuNswHeaderComm 
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
    profile: boolean;

    profileIpName?: string;
    profileInputJSON?: string;
    profileOptionsJSON?: string;

    className?: string;

    mainNavId?: string;
    mainNavIsOpen: boolean;

    getUserDetails(options: { 
      error: any, 
      data: RecordRepresentation 
    }): void;

    // private

    userAlias?: string;

    readonly _isGuest: boolean;

    handleSearch(event: CustomEvent): void;
    handleOpenMenu(event: CustomEvent): void;
    handleHome(event: CustomEvent): void;
  }
}
