declare module "c/sfGpsDsTabBarLwr" { 
  import type SfGpsDsElement from "c/sfGpsDsElement"; 

  export const DATA_TAB_VALUE_ATTR: string;

  export interface TabHeader {
    label: string,
    title?: string,
    value: string,
    vid?: string,
    showErrorIndicator: boolean
  }

  export interface Tab {
    label: string,
    title: string;
    linkId: string,
    vid: string,
    value: string,
    href: string,
    className?: string,
    linkClassName?: string,
    tabIndex: number,
    selected: boolean,
    contentId: string,
    visible: boolean,
    showErrorIndicator: boolean,
    hasFocus?: boolean
  }

  export interface SelectTabOptions {
    hasFocus?: boolean
  }

  export default 
  class SfGpsDsTabBarLwr 
  extends SfGpsDsElement {
    className?: string;

    get tabHeaders(): TabHeader[] | undefined;
    set tabHeaders(tabHeaders: TabHeader[]);

    selectTabByValue(
      value: string
    ): void;
    
    focus(): void;

    tabHeaderToTab(
      tab: Partial<TabHeader>
    ): Tab;

    // private

    _tabHeaders?: TabHeader[];
    _selectedTab?: Tab;
    _tabs: Tab[];
    _queueSynchronizeA11: boolean;
    _activeLinkClassName?: string;

    get computedClassName(): any;
    get _visibleTabs(): Tab[];
    get computedAriaOwns(): string | undefined;
    get _isLightDOM(): boolean;

    _findTabByValue(
      tabValue: string
    ): Tab | undefined;

    _findTemplateTabByValue(
      tabValue: string
    ): HTMLElement | undefined;

    _selectTabAndFireSelectEvent(
      tabValue: string, 
      options: SelectTabOptions
    ): void;

    _selectTab(
      tabValue: string, 
      options: SelectTabOptions
    ): void;

    _tabClassName(
      options?: { 
        selected?: boolean, 
        hasFocus?: boolean 
    }): string | undefined;

    _linkClassName(
      options?: { selected?: boolean }
    ): string | undefined;

    _tabLinkClassName(
      options?: { selected?: boolean }
    ): string | undefined;

    _synchronizeA11y(): void;
    _synchronizeA11yForTabLink(
      tabLink?: Element, 
      tabData?: Tab
    ): void;

    _isPreviousTabKey(event: KeyboardEvent): boolean;
    _isNextTabKey(event: KeyboardEvent): boolean;

    _handleKeyDownOnTabList(
      event: KeyboardEvent,
      currentFocusedIndex: number,
      tabsetInterface: {
        totalTabs: () => number,
        selectTabIndex: (index: number) => void
      }
    ): void;
  
    handleTabClick(event: KeyboardEvent): void;
    handleBlur(event: FocusEvent): void;
    handleFocus(event: FocusEvent): void;
    handleKeyDown(event: KeyboardEvent): void;
  }
}
