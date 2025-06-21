import { 
  api, 
  track 
} from "lwc";
import { 
  handleKeyDownOnTabList 
} from "./keyboard";
import SfGpsDsElement from "c/sfGpsDsElement";

import type { TabHeader, Tab, SelectTabOptions } from "c/sfGpsDsAuNswTabBarLwr";


export default 
class SfGpsDsAuNswLwrTabBar 
extends SfGpsDsElement {
  static renderMode: "light" | "shadow" = "light";

  /* api: tabHeaders, Array of Objects */

  _tabHeaders?: TabHeader[];
  _selectedTab?: Tab;

  // @ts-ignore
  @api
  get tabHeaders(): TabHeader[] | undefined {
    return this._tabHeaders;
  }

  set tabHeaders(tabHeaders: TabHeader[]) {
    this._tabHeaders = tabHeaders || [];

    const tabs = tabHeaders.map((tab) => {
      const classNames = this._tabClassName({});
      const tabValue = String(tab.value);

      return {
        label: tab.label,
        title: tab.title || tab.label,
        linkId: tab.value + "__item",
        domId: tab.domId,
        value: tabValue,
        href: "#" + tabValue,
        className: classNames,
        linkClassName: "",
        tabIndex: -1,
        ariaSelected: false,
        contentId: "",
        visible: true,
        showErrorIndicator: tab.showErrorIndicator
      };
    });

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
      selectedTab.linkClassName = "active";
      selectedTab.ariaSelected = true;
      selectedTab.tabIndex = 0;
    }

    this._tabs = tabs;
    this._queueSynchronizeA11 = true;
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

    const tab = this.querySelector(
      `a[data-tab-value="${this._selectedTab.value}"]`
    ) as HTMLElement;

    if (tab) {
      tab.focus();
    }
  }

  _findTabByValue(tabValue: string): Tab | undefined {
    return this._tabs.find((tab) => tab.value === tabValue);
  }

  _selectTabAndFireSelectEvent(
    tabValue: string, 
    options: SelectTabOptions
  ): void{
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
  }

  _selectTab(
    tabValue: string, 
    options: SelectTabOptions = {}
  ) {
    const tab = this._findTabByValue(tabValue);

    if (!tab) {
      return;
    }

    if (this._selectedTab) {
      if (this._selectedTab.value === tabValue) {
        return;
      }

      this._selectedTab.hasFocus = false;
      this._selectedTab.ariaSelected = false;
      this._selectedTab.className = this._tabClassName({});
      this._selectedTab.linkClassName = "";
      this._selectedTab.tabIndex = -1;
    }

    tab.hasFocus = true;
    tab.ariaSelected = true;
    tab.className = this._tabClassName({
      selected: true,
      hasFocus: options.hasFocus
    });
    tab.linkClassName = "active";
    tab.tabIndex = 0;

    this._selectedTab = tab;
  }

  // eslint-disable-next-line no-unused-vars
  _tabClassName({ selected = false, hasFocus = false }): string | undefined {
    /* NSW DS has no specifics for selected or focus at the tab/li level */
    return undefined;
  }

  _synchronizeA11y(): void {
    const tabLinks = this.querySelectorAll("a[role='tab']");

    tabLinks.forEach((tabLink) => {
      const tabData = this._tabs.find(
        (tab) => tabLink.getAttribute("data-tab-value") === tab.value
      );

      if (tabData) {
        tabLink.setAttribute("id", tabData.linkId);
        tabLink.setAttribute("aria-controls", tabData.domId);
      }
    });
  }

  /* event management */

  handleTabClick(
    event: KeyboardEvent
  ): void {
    event.preventDefault();

    const clickedTabValue = (event.target as HTMLElement).getAttribute("data-tab-value");

    if (clickedTabValue) {
      this._selectTabAndFireSelectEvent(
        clickedTabValue, 
        { hasFocus: true }
      );
    }
  }

  handleBlur(
    event: FocusEvent
  ): void {
    const tabValue = (event.target as HTMLElement).getAttribute("data-tab-value");

    if (tabValue && this._selectedTab) {
      const tab = this._findTabByValue(tabValue);

      if (tab) {
        tab.className = this._tabClassName({
          selected: this._selectedTab.value === tab.value,
          hasFocus: false
        });
      }
    }
  }

  handleFocus(
    event: FocusEvent
  ): void {
    const target = event.target as HTMLElement
    const tabValue = target.getAttribute("data-tab-value");

    if (tabValue && this._selectedTab) {
      const tab = this._findTabByValue(tabValue);

      if (tab) {
        tab.className = this._tabClassName({
          selected: this._selectedTab.value === tab.value,
          hasFocus: true
        });
      }
    }
  }

  handleKeyDown(
    event: KeyboardEvent
  ): void {
    let currentFocusedIndex = 0;

    if (this._selectedTab) {
      currentFocusedIndex = this._visibleTabs.findIndex(
        (tab) => tab.value === (this._selectedTab as Tab).value
      );
    }

    handleKeyDownOnTabList(event, currentFocusedIndex, {
      totalTabs: () => this._visibleTabs.length,
      selectTabIndex: (index: number) => {
        const tab = this._visibleTabs[index];
        this._selectTabAndFireSelectEvent(tab.value, {
          hasFocus: true
        });

        const targetTab = this.querySelector(`a[data-tab-value="${tab.value}"]`) as HTMLElement;
        targetTab.focus();
      }
    });
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
