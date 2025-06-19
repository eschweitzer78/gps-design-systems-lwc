declare module "c/sfGpsDsAuNswTabSetLwr" { 
  import type SfGpsDsElement from "c/sfGpsDsElement"; 
  import type { PropertyAccessor } from "c/sfGpsDsElement";
  import type { TabHeader } from "c/sfGpsDsAuNswTabBarLwr";
  import type SfGpsDsAuNswTabLwr from "c/sfGpsDsAuNswTabLwr";
  import type SfGpsDsAuNswTabBarLwr from "c/sfGpsDsAuNswTabBarLwr";

  export default 
  class SfGpsDsAuNswTabSetLwr 
  extends SfGpsDsElement {
    title: string;
    tabClassName: string;
    firstChild: boolean;
    activeTabValue: string;

    focus(): void;

    // private

    _firstChild: PropertyAccessor<boolean>;
    _activeTabValue: string;
    _tabByValue: Record<string, SfGpsDsAuNswTabLwr>;
    _tabHeaders: TabHeader[];

    _selectTab(
      value: string
    ): void;

    _showTabContentForTabValue(
      value: string
    ): void;

    _selectTabHeaderByTabValue(
      value: string
    ): void;

    _updateTabBarHeaders(
      headers: TabHeader[]
    ): void;

    readonly tabBar: SfGpsDsAuNswTabBarLwr;

    handleTabRegister(
      event: CustomEvent
    ): void;

    handleTabSelected(
      event: CustomEvent
    ): void;

    handleTabDataChange(
      event: CustomEvent
    ): void;
  }
}
