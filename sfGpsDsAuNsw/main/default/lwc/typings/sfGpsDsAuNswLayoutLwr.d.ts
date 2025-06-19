declare module "c/sfGpsDsAuNswLayoutLwr" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";
  import type SfGpsDsElement, { PropertyAccessor } from "c/sfGpsDsElement";
  import type { Link } from "c/sfGpsDsMarkdown";

  export type Mode =
    "Full Width" | 
    "Sidebar Left" | 
    "Sidebar Left Desktop" |
    "Sidebar Right" |
    "Sidebar Right Desktop";

  export default 
  class SfGpsDsAuNswLayoutLwr 
  extends SfGpsDsLwc {
    mode: Mode;
    sidebarClassName: string;
    mainClassName: string;
    className: string;

    // private

    readonly computedShowSidebarLeft: boolean;
    readonly computedShowSidebarRight: boolean;
    readonly computedClassName: any;
    readonly computedMainClassName: any;
    readonly computedSidebarClassName: any
  }
}
