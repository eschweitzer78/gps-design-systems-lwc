declare module "c/sfGpsDsAuNswSupportList" { 
  import type SfGpsDsElement from "c/sfGpsDsElement"; 
  import type { PropertyAccessor } from "c/sfGpsDsElement";
  import type { Link } from "c/sfGpsDsMarkdown";
 
  export type LogoPosition =
    "none" |
    "labels" |
    "logos";

  export default 
  class SfGpsDsAuNswSupportList 
  extends SfGpsDsElement {
    header?: string;
    departments?: Link[];
    supportLogos?: Link[];
    className?: string;
    logoPosition?: LogoPosition;

    // private

    _logoPosition: PropertyAccessor<LogoPosition>;

    get i18n(): Record<string, string>;
    get computedClassName(): any;
    get computedContainerClassName(): any;
    get computedShowLogoTop(): boolean;
    get computedShowLogoBottom(): boolean;
    get computedHasDepartments(): boolean;
    get computedHasSupportLogos(): boolean;
  }
}
