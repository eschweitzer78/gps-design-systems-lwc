declare module "c/sfGpsDsAuNswLayoutLwr" {
  import type SfGpsDsLwc from "c/sfGpsDsLwc";
  import type { PropertyAccessor } from "c/sfGpsDsElement";
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
    mode?: Mode;
    sidebarClassName?: string;
    mainClassName?: string;
    className?: string;

    // private

    get computedShowSidebarLeft(): boolean;
    get computedShowSidebarRight(): boolean;
    get computedClassName(): any;
    get computedMainClassName(): any;
    get computedSidebarClassName(): any
  }
}
