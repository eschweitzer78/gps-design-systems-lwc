declare module "c/sfGpsDsAuNswTabBarLwr" { 
  import type SfGpsDsTabBarLwr from "c/sfGpsDsTabBarLwr"; 
  import type { 
    TabHeader as BaseTabHeader, 
    Tab as BaseTab, 
    SelectTabOptions as BaseSelectTabOptions 
  } from "c/sfGpsDsTabBarLwr";

  export type TabHeader = BaseTabHeader;
  export type Tab = BaseTab;
  export type SelectTabOptions = BaseSelectTabOptions;

  export default 
  class SfGpsDsAuNswTabBarLwr 
  extends SfGpsDsTabBarLwr {
    // private
    
    static renderMode: "light" | "shadow";

    get _isLightDOM(): boolean;
    _tabLinkClassName(options?: { selected?: boolean }): string | undefined;
  }
}
