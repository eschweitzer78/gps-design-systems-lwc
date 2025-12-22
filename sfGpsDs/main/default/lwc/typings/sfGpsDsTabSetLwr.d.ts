declare module "c/sfGpsDsTabSetLwr" { 
  import type SfGpsDsElement from "c/sfGpsDsElement"; 
  import type { PropertyAccessor } from "c/sfGpsDsElement";
  import type { TabHeader, Tab } from "c/sfGpsDsTabBarLwr";
  import type SfGpsDsTabLwr from "c/sfGpsDsTabLwr";
  import type SfGpsDsTabBarLwr from "c/sfGpsDsTabBarLwr";

  export default 
  class SfGpsDsTabSetLwr 
  extends SfGpsDsElement {
    // title: string | undefined;
    className?: string;
    tabClassName?: string;

    get activeTabValue(): string | undefined;
    set activeTabValue(tabValue: string);

    focus(): void;

    // private

    _activeTabValue?: string;
    _tabByValue: Record<string, SfGpsDsTabLwr>;
    _tabHeaders: TabHeader[];

    get tabBar(): SfGpsDsTabBarLwr;
    get computedClassName(): any;
    
    _selectTab(
      tabValue: string
    ): void;

    _showTabContentForTabValue(
      tabValue: string
    ): void;

    _selectTabHeaderByTabValue(
      tabValue: string
    ): void;

    _updateTabBarHeaders(
      headers: TabHeader[]
    ): void;

    _updateTabHeader(
      matchingTabHeader: TabHeader, 
      changedTab: Partial<Tab>
    ): void;

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
