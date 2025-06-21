
declare module "c/sfGpsDsAuNswLowerFooterIp" {
  import type SfGpsDsNavigation from "c/sfGpsDsNavigation";
  import type { PropertyAccessor } from "c/sfGpsDsElement";

  export default 
  class SfGpsDsAuNswLowerFooterIp 
  extends SfGpsDsNavigation {
    statement?: string;
    linkedInUrl?: string;
    twitterXUrl?: string;
    facebookUrl?: string;
    className?: string;

    copyrightMention?: string;
    builtMention?: string;

    // private

    _copyrightMention: PropertyAccessor<string>;
    _builtMention: PropertyAccessor<string>;

    get computedShowSocial(): boolean;

    handleNavClick(event: CustomEvent): void;
  }
}
