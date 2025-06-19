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
    header: string;
    departments: Link[];
    supportLogos: Link[];
    className: string;

    logoPosition: LogoPosition;

    // private

    _logoPosition: PropertyAccessor<LogoPosition>;

    readonly i18n: Record<string, string>;
    readonly computedClassName: any;
    readonly computedContainerClassName: any;
    readonly computedShowLogoTop: boolean;
    readonly computedShowLogoBottom: boolean;
    readonly computedHasDepartments: boolean;
    readonly computedHasSupportLogos: boolean;
  }
}
