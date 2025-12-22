declare module "c/sfGpsDsAuVic2TabBarLwr" {
  import type SfGpsDsTabBarLwr from "c/sfGpsDsTabBarLwr";
  import type { TabHeader, Tab } from "c/sfGpsDsTabBarLwr";
  import type { PropertyAccessor } from "c/sfGpsDsElement";

  export interface Vic2TabHeader extends TabHeader {
    iconName?: string
  }

  export interface Vic2Tab extends Tab {
    iconName?: string
  }

  export type Mode = 
    "horizontal" | 
    "vertical"; 

  export default 
  class SfGpsDsAuVic2TabBarLwr 
  extends SfGpsDsTabBarLwr {
    static renderMode: "light" | "shadow";

    mode?: string;

    // private

    _mode: PropertyAccessor<Mode>;
  }
}