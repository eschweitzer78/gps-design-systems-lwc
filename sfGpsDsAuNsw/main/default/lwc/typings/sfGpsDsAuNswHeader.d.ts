declare module "c/sfGpsDsAuNswHeader" {
  import type SfGpsDsElement from "c/sfGpsDsElement"; 
  import type { PropertyAccessor } from "c/sfGpsDsElement";

  export type Stacking = 
    "vertical" | 
    "horizontal";

  export default 
  class sfGpsDsAuNswHeader 
  extends SfGpsDsElement {
    masterbrand?: string;
    masterbrandAlt?: string;
    srMasterbrandLabel: string;
    logo?: string;
    logoAlt?: string;
    menuLabel: string;
    searchLabel: string;
    siteTitle?: string;
    siteDescriptor?: string;
    headerUrl: string;
    searchAriaLabel: string;
    className?: string;

    value: string;

    mainNavId?: string;
    mainNavIsOpen: boolean;
    searchIsOpen: boolean;

    mobile?: boolean;
    search?: boolean;
    profile?: boolean;
    mobileLogoStacking?: Stacking;

    // private

    _mobile: PropertyAccessor<boolean>;
    _search: PropertyAccessor<boolean>;
    _profile: PropertyAccessor<boolean>;
    _mobileLogoStacking: PropertyAccessor<Stacking>;

    get computedClassName(): any;

    _headerSearchId?: string;
    get computedHeaderSearchId(): string;

    _headerInputId?: string;
    get computedHeaderInputId(): string;

    get _areLogosHorizontallyStacked(): boolean;
    get _areLogosVerticallyStacked(): boolean;

    get computedHeaderUrl(): string;

    setSearchVisible(
      visible: boolean
    ): void;

    handleCloseSearch(event: MouseEvent): void;
    handleOpenSearch(event: MouseEvent): void;
    handleChange(event: InputEvent): void;
    handleKeyUp(event: KeyboardEvent): void;
    handleSearch(event: KeyboardEvent): void;
    handleOpenMenu(event: MouseEvent): void;
    handleLogoClick(event: MouseEvent): void;
  }
}
