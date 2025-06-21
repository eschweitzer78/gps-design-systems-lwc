import { 
  api 
} from "lwc";
import { 
  uniqueId 
} from "c/sfGpsDsHelpers";
import SfGpsDsElement from "c/sfGpsDsElement";
import SfGpsDsAuNswTabLwr from "c/sfGpsDsAuNswTabLwr";

import type SfGpsDsAuNswTabBarLwr from "c/sfGpsDsAuNswTabBarLwr";
import type { 
  TabHeader 
} from "c/sfGpsDsAuNswTabBarLwr";

const TAB_BAR_SELECTOR = "c-sf-gps-ds-au-nsw-tab-bar-lwr";
const TAB_PREFIX = "tab";

const FIRSTCHILD_DEFAULT = false;

export default 
class sfGpsDsAuNswTabSetLwr
extends SfGpsDsElement {
  static renderMode: "light" | "shadow" = "light";

  // @ts-ignore
  @api 
  title = "";

  // @ts-ignore
  @api
  tabClassName?: string;

  // @ts-ignore
  @api 
  // @ts-ignore
  firstChild?: boolean;
  _firstChild = this.defineBooleanProperty("firstChild", {
    defaultValue: FIRSTCHILD_DEFAULT
  });

  /* api: activeTabValue */

  _activeTabValue?: string;
  _tabByValue: Record<string, SfGpsDsAuNswTabLwr | undefined> = {};
  _tabHeaders: TabHeader[] = [];

  // @ts-ignore
  @api
  get activeTabValue(): string | undefined {
    return this._activeTabValue;
  }

  set activeTabValue(tabValue: string) {
    const newTabValue = tabValue && String(tabValue);
    if (!newTabValue || this._activeTabValue === newTabValue) {
      return;
    }

    if (this._isConnected) {
      const tab = this._tabByValue[tabValue];

      if (tab) {
        this._selectTab(tabValue);
      }
    } else {
      this._activeTabValue = newTabValue;
    }
  }

  /* methods */

  _selectTab(
    value: string
  ): void {
    this._selectTabHeaderByTabValue(value);
    this._showTabContentForTabValue(value);
  }

  _showTabContentForTabValue(
    value: string
  ): void {
    const tab = this._tabByValue[value];

    if (!tab) {
      return;
    }

    if (this._activeTabValue) {
      const currentTab = this._tabByValue[this._activeTabValue];

      if (currentTab) {
        currentTab.vhidden = true;
      }
    }

    this._activeTabValue = tab.value;
    tab.vhidden = false;
    tab.loadContent();
  }

  _selectTabHeaderByTabValue(
    value: string
  ): void {
    if (!this._isConnected) {
      return;
    }

    this.tabBar.selectTabByValue(value);
  }

  _updateTabBarHeaders(
    headers: TabHeader[]
  ): void {
    this.tabBar.tabHeaders = headers.slice();
  }

  get tabBar(): SfGpsDsAuNswTabBarLwr {
    return this.querySelector(TAB_BAR_SELECTOR) as unknown as SfGpsDsAuNswTabBarLwr;
  }

  // @ts-ignore
  @api
  focus(): void {
    this.tabBar.focus();
  }

  /* event management */

  handleTabRegister(
    event: CustomEvent
  ): void {
    event.stopPropagation();

    const target = event.target as HTMLElement;
    const tab = event.target as SfGpsDsAuNswTabLwr;
    const generatedUniqueId = uniqueId(TAB_PREFIX);

    tab.className = this.tabClassName;
    tab.vid = generatedUniqueId;

    if (!tab.value) {
      tab.value = generatedUniqueId;
    }

    const tabValue = tab.value;

    target.dataset.tabValue = tabValue;
    tab.variaLabelledBy = tabValue + "__item";
    tab.vhidden = true;

    const tabs = this.querySelectorAll(`[role="tabpanel"]`);
    let tabIndex: number;

    for (tabIndex = 0; tabIndex < tabs.length; tabIndex++) {
      const tab = tabs[tabIndex] as HTMLElement;
      if (tab.dataset.tabValue === tabValue) {
        break;
      }
    }

    event.detail.setDeregistrationCallback(() => {
      if (!this._isConnected) {
        return;
      }

      const index = this._tabHeaders.findIndex(
        (existingTab) => existingTab.value === tabValue
      );

      if (index >= 0) {
        this._tabHeaders.splice(index, 1);
        this._updateTabBarHeaders(this._tabHeaders);
        this._tabByValue[tabValue] = undefined;

        if (this._activeTabValue === tab.value && this._tabHeaders.length > 0) {
          this._showTabContentForTabValue(this._tabHeaders[0].value);
        }
      }
    });

    this._tabHeaders.splice(tabIndex, 0, {
      value: tabValue,
      label: tab.label,
      domId: tab.vid,
      title: tab.title,
      showErrorIndicator: tab.showErrorIndicator
    });

    this._updateTabBarHeaders(this._tabHeaders);
    this._tabByValue[tabValue] = tab;

    if (!this._activeTabValue) {
      this._activeTabValue = tab.value;
    }

    if (this._activeTabValue === tab.value) {
      this._selectTab(tabValue);
    }
  }
  
  handleTabSelected(
    event: CustomEvent
  ): void {
    const selectedTabValue = event.detail.value;
    const tab = this._tabByValue[selectedTabValue];
    if (this._activeTabValue !== tab?.value) {
      this._showTabContentForTabValue(selectedTabValue);
    }
  }

  handleTabDataChange(
    event: CustomEvent
  ): void {
    const target = event.target as HTMLElement;
    const changedTab = event.target as SfGpsDsAuNswTabLwr;
    const newTabValue = changedTab.value;
    const currentTabValue = target.dataset.tabValue;
    const matchingTabHeader = this._tabHeaders.find(
      (tabHeader) => tabHeader.value === currentTabValue
    );

    if (
      currentTabValue == undefined || 
      newTabValue == undefined
    )
      return;

    if (matchingTabHeader) {
      matchingTabHeader.label = changedTab.label;
      matchingTabHeader.value = newTabValue;
      matchingTabHeader.title = changedTab.title;
      matchingTabHeader.showErrorIndicator = changedTab.showErrorIndicator;
    }

    this._updateTabBarHeaders(this._tabHeaders);

    if (currentTabValue !== newTabValue) {
      const tab = this._tabByValue[currentTabValue];

      if (tab) {
        (tab as unknown as HTMLElement).dataset.tabValue = newTabValue;
        this._tabByValue[newTabValue] = this._tabByValue[currentTabValue];

        this._tabByValue[currentTabValue] = undefined;
      }

      if (this._activeTabValue === currentTabValue) {
        this._activeTabValue = newTabValue;
      }
    }
  }
}
