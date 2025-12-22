import { 
  api, 
  track 
} from "lwc";
import SfGpsDsElement from "c/sfGpsDsElement";

import type { TabHeader, Tab, SelectTabOptions } from "c/sfGpsDsTabBarLwr";

export const DATA_TAB_VALUE_ATTR = "data-tab-value";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsTabBarLwr";

export default 
class SfGpsDsTabBarLwr 
extends SfGpsDsElement {
  // @ts-ignore
  @api
  className?: string;

  /* api: tabHeaders, Array of Objects */

  _tabHeaders?: TabHeader[];
  _selectedTab?: Tab;

  // @ts-ignore
  @api
  get tabHeaders(): TabHeader[] | undefined {
    return this._tabHeaders;
  }

  set tabHeaders(tabHeaders: TabHeader[]) {
    if (DEBUG) console.debug(CLASS_NAME, "> set tabHeader", tabHeaders);

    this._tabHeaders = tabHeaders || [];

    const tabs = tabHeaders.map((tab) => this.tabHeaderToTab(tab));
    let selectedTab: Tab | undefined = tabs[0];

    if (this._selectedTab) {
      selectedTab = tabs.find((tab) => tab.value === (this._selectedTab as Tab).value);

      if (!selectedTab) {
        selectedTab = tabs[0];
      }
    }

    if (selectedTab) {
      this._selectedTab = selectedTab;
      selectedTab.className = this._tabClassName({ selected: true });
      selectedTab.linkClassName = this._linkClassName({ selected: true });
      selectedTab.selected = true;
      selectedTab.tabIndex = 0;
    }

    this._tabs = tabs;
    this._queueSynchronizeA11 = true;

    if (DEBUG) console.debug(CLASS_NAME, "< set tabHeader", tabs);
  }

  // @ts-ignore
  @track 
  _tabs: Tab[] = [];

  // @ts-ignore
  @track 
  _queueSynchronizeA11: boolean = false;

  /* getters */

  get _visibleTabs(): Tab[] {
    return this._tabs.filter((tab) => tab.visible);
  }

  get computedAriaOwns(): string | undefined {
    return this._tabs?.length
      ? this._tabs.map((item) => item.linkId).join(" ")
      : undefined;
  }

  get _isLightDOM() {
    return false;
  }

  get computedClassName(): any {
    return {
      [this.className || ""]: !!this.className
    };
  }

  /* methods */

  // @ts-ignore
  @api
  selectTabByValue(tabValue: string) {
    this._selectTab(tabValue);
  }

  // @ts-ignore
  @api
  focus(): void {
    if (!this._selectedTab) {
      return;
    }

    this._findTemplateTabByValue(this._selectedTab.value)?.focus();
  }

  _findTabByValue(tabValue: string): Tab | undefined {
    if (DEBUG) console.debug(CLASS_NAME, "> _findTabByValue", tabValue);

    const rv = this._tabs.find((tab) => tab.value === tabValue);

    if (DEBUG) console.debug(CLASS_NAME, "< _findTabByValue", rv);
    return rv;
  }

  _findTemplateTabByValue(tabValue: string): HTMLElement | undefined {
    if (DEBUG) console.debug(CLASS_NAME, "> _findTemplateTabByValue", tabValue);

    const target = this._isLightDOM ? this : this.template;
    const rv = target.querySelector(`a[${DATA_TAB_VALUE_ATTR}="${tabValue}"]`) as HTMLElement;

    if (DEBUG) console.debug(CLASS_NAME, "< _findTemplateTabByValue", rv);
    return rv;

  }

  _selectTabAndFireSelectEvent(
    tabValue: string, 
    options: SelectTabOptions
  ): void{
    if (DEBUG) console.debug(CLASS_NAME, "> _selectTabAndFireSelectEvent", tabValue, options);

    this._selectTab(tabValue, options);

    const tab = this._findTabByValue(tabValue);

    if (tab) {
      this.dispatchEvent(
        new CustomEvent("select", {
          detail: {
            value: tab.value,
            label: tab.label
          }
        })
      );
    }

    if (DEBUG) console.debug(CLASS_NAME, "< _selectTabAndFireSelectEvent", tab?.value);
  }

  _selectTab(
    tabValue: string, 
    options: SelectTabOptions = {}
  ) {
    if (DEBUG) console.debug(CLASS_NAME, "> _selectTab", tabValue, options);

    const tab = this._findTabByValue(tabValue);

    if (!tab) {
      return;
    }

    if (this._selectedTab) {
      if (this._selectedTab.value === tabValue) {
        return;
      }

      this._selectedTab.hasFocus = false;
      this._selectedTab.selected = false;
      this._selectedTab.className = this._tabClassName({});
      this._selectedTab.linkClassName = this._linkClassName({ selected: false });
      this._selectedTab.tabIndex = -1;
    }

    tab.hasFocus = true;
    tab.selected = true;
    tab.className = this._tabClassName({
      selected: true,
      hasFocus: options.hasFocus
    });
    tab.linkClassName = this._linkClassName({ 
      selected: true 
    });
    tab.tabIndex = 0;

    this._selectedTab = tab;

    if (DEBUG) console.debug(CLASS_NAME, "< _selectTab", tab);
  }

  // eslint-disable-next-line no-unused-vars
  _tabClassName(options?: { selected?: boolean, hasFocus?: boolean }): string | undefined {
    return undefined;
  }

  _linkClassName(options?: { selected?: boolean }): string | undefined {
    return (options || {}).selected ? "active" : "";
  }

  // @ts-ignore
  @api
  tabHeaderToTab(
    tab: TabHeader
  ): Tab {
    if (DEBUG) console.debug(CLASS_NAME, "> tabHeaderToTab", tab);

    const className = this._tabClassName({});
    const tabValue = tab.value;
    const rv = {
      label: tab.label,
      title: tab.title || tab.label,
      linkId: tab.value + "__item",
      vid: tab.vid,
      value: tabValue,
      href: "#" + tabValue,
      className: className,
      linkClassName: this._linkClassName(),
      tabIndex: -1,
      selected: false,
      contentId: "",
      visible: true,
      showErrorIndicator: tab.showErrorIndicator
    }

    if (DEBUG) console.debug(CLASS_NAME, "< tabHeaderToTab", rv);
    return rv;
  }

  _synchronizeA11y(): void {
    const target = this._isLightDOM ? this : this.template;
    const tabLinks = target.querySelectorAll("[role='tab']");

    tabLinks.forEach((tabLink) => {
      const tabData = this._tabs.find(
        (tab) => tabLink.getAttribute(DATA_TAB_VALUE_ATTR) === tab.value
      );
      this._synchronizeA11yForTabLink(tabLink, tabData);
    });
  }

  _synchronizeA11yForTabLink(
    tabLink?: Element, 
    tabData?: Tab
  ): void {
      if (tabData) {
        tabLink?.setAttribute("id", tabData.linkId);
        tabLink?.setAttribute("aria-controls", tabData.vid);
      }
  }

  /* event management */

  handleTabClick(
    event: MouseEvent
  ): void {
    if (DEBUG) console.debug(CLASS_NAME, "> handleTabClick", event.currentTarget);

    event.preventDefault();

    const currentTarget = event.currentTarget as HTMLElement;
    const clickedTabValue = currentTarget.getAttribute(DATA_TAB_VALUE_ATTR);

    if (clickedTabValue) {
      this._selectTabAndFireSelectEvent(
        clickedTabValue, 
        { hasFocus: true }
      );
    }

    if (DEBUG) console.debug(CLASS_NAME, "< handleTabClick", clickedTabValue);
  }

  handleBlur(
    event: FocusEvent
  ): void {
    if (DEBUG) console.debug(CLASS_NAME, "> handleBlur", event.target);

    const tabValue = (event.target as HTMLElement).getAttribute(DATA_TAB_VALUE_ATTR);

    if (tabValue && this._selectedTab) {
      const tab = this._findTabByValue(tabValue);
      if (DEBUG) console.debug(CLASS_NAME, "= handleBlur", tab);

      if (tab) {
        tab.className = this._tabClassName({
          selected: this._selectedTab.value === tab.value,
          hasFocus: false
        });
      }
    }

    if (DEBUG) console.debug(CLASS_NAME, "< handleBlur");
  }

  handleFocus(
    event: FocusEvent
  ): void {
    if (DEBUG) console.debug(CLASS_NAME, "> handleFocus", event.target);

    const target = event.target as HTMLElement
    const tabValue = target.getAttribute(DATA_TAB_VALUE_ATTR);

    if (tabValue && this._selectedTab) {
      const tab = this._findTabByValue(tabValue);
      if (DEBUG) console.debug(CLASS_NAME, "= handleFocus", tab);

      if (tab) {
        tab.className = this._tabClassName({
          selected: this._selectedTab.value === tab.value,
          hasFocus: true
        });
      }
    }

    if (DEBUG) console.debug(CLASS_NAME, "< handleFocus");
  }

  _isPreviousTabKey(event: KeyboardEvent): boolean {
    return event.key === "ArrowLeft" || event.key === "ArrowUp";
  }

  _isNextTabKey(event: KeyboardEvent): boolean {
    return event.key === "ArrowRight" || event.key === "ArrowDown"
  }

  _handleKeyDownOnTabList(
    event: KeyboardEvent,
    currentFocusedIndex: number,
    tabsetInterface: {
      totalTabs: () => number,
      selectTabIndex: (index: number) => void
    }
  ): void {
    const isPreviousTabKey = this._isPreviousTabKey(event);
    const isNextTabKey = this._isNextTabKey(event);

    if (DEBUG) {
      console.debug(CLASS_NAME, "> _handleKeyDownOnTabList", isPreviousTabKey, isNextTabKey);
    }

    if (isPreviousTabKey || isNextTabKey) {
      event.preventDefault();
      event.stopPropagation();

      const increment = isPreviousTabKey ? -1 : 1;
      let newIndex = currentFocusedIndex + increment;
      if (newIndex < 0) {
        newIndex = tabsetInterface.totalTabs() - 1;
      }

      if (newIndex + 1 > tabsetInterface.totalTabs()) {
        newIndex = 0;
      }

      tabsetInterface.selectTabIndex(newIndex);

      if (DEBUG) {
        console.debug(CLASS_NAME, "= _handleKeyDownOnTabList newIndex", newIndex);
      }
    }

    if (DEBUG) {
      console.debug(CLASS_NAME, "< _handleKeyDownOnTabList");
    }
  }

  handleKeyDown(
    event: KeyboardEvent
  ): void {
    if (DEBUG) {
      console.debug(CLASS_NAME, "> handleKeyDown keyCode=", event.keyCode);
    }

    let currentFocusedIndex = 0;

    if (this._selectedTab) {
      currentFocusedIndex = this._visibleTabs.findIndex(
        (tab) => tab.value === (this._selectedTab as Tab).value
      );
    }

    if (DEBUG) {
      console.debug(CLASS_NAME, "> handleKeyDown already selected", this._selectedTab, currentFocusedIndex);
    }

    this._handleKeyDownOnTabList(event, currentFocusedIndex, {
      totalTabs: () => this._visibleTabs.length,
      selectTabIndex: (index: number) => {
        const tab = this._visibleTabs[index];
        this._selectTabAndFireSelectEvent(tab.value, {
          hasFocus: true
        });

        this._findTemplateTabByValue(tab.value)?.focus();
      }
    });

    if (DEBUG) {
      console.debug(CLASS_NAME, "< handleKeyDown");
    }
  }

  /* Lifecycle */

  renderedCallback() {
    super.renderedCallback?.();

    if (this._queueSynchronizeA11) {
      this._synchronizeA11y();
      this._queueSynchronizeA11 = false;
    }
  }
}
