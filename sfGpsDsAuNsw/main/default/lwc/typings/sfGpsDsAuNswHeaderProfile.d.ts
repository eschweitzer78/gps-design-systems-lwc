declare module "c/sfGpsDsAuNswHeaderProfile" {
  import type SfGpsDsElement from "c/sfGpsDsElement";
  import type { AdaptedNavigationMenuItem } from "c/sfGpsDsNavigation";
  import type OnClickOutside from "c/sfGpsDsOnClickOutside";

  export default 
  class SfGpsDsAuNswHeaderProfile 
  extends SfGpsDsElement {
    signInLabel: string;
    isGuest?: boolean;
    userAlias?: string;
    navItems?: AdaptedNavigationMenuItem[];
    className?: string;

    // private

    _isOpen: boolean;

    handleOpenProfile(event: MouseEvent): void;
    handleCloseProfile(event: MouseEvent): void;
    handleLogin(event: MouseEvent): void;
    handleClickNavigate(event: MouseEvent): void;
    ignore(event: MouseEvent): void;

    _onClickOutside?: OnClickOutside;

  }
}
