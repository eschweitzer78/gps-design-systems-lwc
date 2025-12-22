declare module "c/sfGpsDsAuQldTabBar" { 
  import type SfGpsDsTabBarLwr from "c/sfGpsDsTabBarLwr"; 
  import type { 
    TabHeader as BaseTabHeader, 
    Tab as BaseTab, 
    SelectTabOptions as BaseSelectTabOptions 
  } from "c/sfGpsDsTabBarLwr";
  import type OnWindowResize from "c/sfGpsDsOnWindowResize";

  export interface TabHeader extends BaseTabHeader {
    iconName?: string,
    iconUrl?: string
  }

  export interface Tab extends BaseTab {
    iconName?: string,
    iconUrl?: string
  }
  
  export type SelectTabOptions = BaseSelectTabOptions;

  export default 
  class SfGpsDsAuNswTabBarLwr 
  extends SfGpsDsTabBarLwr {
    // private
    
    static renderMode: "light" | "shadow";

    get _isLightDOM(): boolean;
    get i18n(): Record<string, string>;
    get computedChevronLeftIconUrl(): string;
    get computedChevronRightIconUrl(): string;

    tabHeaderToTab(tab: TabHeader): Tab;
    _tabLinkClassName(options?: { selected?: boolean }): string | undefined;

    checkOverflow(): void;
    handleScrollRight(): void;
    handleScrollLeft(): void;

    _hasOverflow: boolean;
    _onWindowResize?: OnWindowResize;
  }
}
