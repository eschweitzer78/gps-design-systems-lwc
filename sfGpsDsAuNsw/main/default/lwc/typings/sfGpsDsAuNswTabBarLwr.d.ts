declare module "c/sfGpsDsAuNswTabBarLwr" { 
  import type SfGpsDsElement from "c/sfGpsDsElement"; 
  import type { PropertyAccessor } from "c/sfGpsDsElement";

  interface TabHeader {
    label: string,
    title?: string,
    value: string,
    domId: string,
    showErrorIndicator: boolean
  }

  interface Tab {
    label: string,
    title: string;
    linkId: string,
    domId: string,
    value: string,
    href: string,
    className: string,
    linkClassName: string,
    tabIndex: number,
    ariaSelected: boolean,
    contentId: string,
    visible: boolean,
    showErrorIndicator: boolean,
    hasFocus?: boolean
  }

  interface SelectTabOptions {
    hasFocus?: boolean
  }

  export default 
  class SfGpsDsAuNswTabBarLwr 
  extends SfGpsDsElement {
    tabHeaders: TabHeader[];

    selectTabByValue(tabValue: string);
    focus(): void;

    // private

    _tabHeaders: TabHeader[];
    _selectedTab: Tab;
    _tabs: Tab[];

    _queueSynchronizeA11: boolean;

    readonly _visibleTabs: Tab[];
    readonly computedAriaOwns: string;

    _findTabByValue(tabValue: string): Tab;
    _selectTabAndFireSelectEvent(
      tabValue: string, 
      options: SelectTabOptions
    ): void;
    _selectTab(
      tabValue: string, 
      options: SelectTabOptions = {}
    ): void;
    _tabClassName(options: { selected?: boolean, hasFocus?: boolean }): string;
    
    _synchronizeA11y(): void;

    handleTabClick(event: KeyboardEvent): void;
    handleBlur(event: FocusEvent): void;
    handleFocus(event: FocusEvent): void;
    handleKeyDown(event: KeyboardEvent): void;
  }
}
