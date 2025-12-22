import { 
  api 
} from "lwc";
import { 
  uniqueId 
} from "c/sfGpsDsHelpers";
import SfGpsDsElement from "c/sfGpsDsElement";
import SfGpsDsTabLwr from "c/sfGpsDsTabLwr";

import type SfGpsDsTabBarLwr from "c/sfGpsDsTabBarLwr";
import type { 
  TabHeader,
  Tab
} from "c/sfGpsDsTabBarLwr";

const TAB_PREFIX = "tab";

const DEBUG = false;
const CLASS_NAME = "SfGpsDsTabSetLwr";

export default 
class sfGpsDsAuNswTabSetLwr
extends SfGpsDsElement {
  // @ts-ignore
  @api 
  title = undefined;

  // @ts-ignore
  @api
  tabClassName?: string;

  /* api: activeTabValue */

  _activeTabValue?: string;
  _tabByValue: Record<string, SfGpsDsTabLwr | undefined> = {};
  _tabHeaders: TabHeader[] = [];

  // @ts-ignore
  @api
  get activeTabValue(): string | undefined {
    return this._activeTabValue;
  }

  set activeTabValue(tabValue: string) {
    if (DEBUG) console.debug(CLASS_NAME, "> set activeTabValue", tabValue);

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

    if (DEBUG) console.debug(CLASS_NAME, "< set activeTabValue", this._activeTabValue);
  }

  // @ts-ignore
  @api 
  className?: string;

  /* getters */
  
  get tabBar(): SfGpsDsTabBarLwr {
    return this.refs.tabbar as unknown as SfGpsDsTabBarLwr;
  }

  get computedClassName(): any {
    return {
      [this.className || ""]: !!this.className
    };
  }
    
  /* methods */

  _selectTab(
    tabValue: string
  ): void {
    this._selectTabHeaderByTabValue(tabValue);
    this._showTabContentForTabValue(tabValue);
  }

  _showTabContentForTabValue(
    tabValue: string
  ): void {
    if (DEBUG) console.debug(CLASS_NAME, "> _showTabContentForTabValue", tabValue);

    const tab = this._tabByValue[tabValue];

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

    if (DEBUG) console.debug(CLASS_NAME, "< _showTabContentForTabValue", tab);
  }

  _selectTabHeaderByTabValue(
    tabValue: string
  ): void {
    if (DEBUG) console.debug(CLASS_NAME, "> _selectTabHeaderByTabValue", tabValue);

    if (this._isConnected) {
      this.tabBar.selectTabByValue(tabValue);
    }

    if (DEBUG) console.debug(CLASS_NAME, "< _selectTabHeaderByTabValue", this._isConnected);
  }

  _updateTabBarHeaders(
    headers: TabHeader[]
  ): void {
    this.tabBar.tabHeaders = headers.slice();
  }

  _updateTabHeader(matchingTabHeader: TabHeader, changedTab: Partial<Tab>): void {
    matchingTabHeader.label = changedTab.label;
    matchingTabHeader.value = changedTab.value;
    matchingTabHeader.title = changedTab.title;
    matchingTabHeader.showErrorIndicator = changedTab.showErrorIndicator;
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
    if (DEBUG) console.debug(CLASS_NAME, "> handleTabRegister", event.target);

    event.stopPropagation();

    const target = event.target as HTMLElement;
    const registeredTab = event.target as SfGpsDsTabLwr;
    const generatedUniqueId = uniqueId(TAB_PREFIX);

    registeredTab.className = this.tabClassName;
    registeredTab.vid = generatedUniqueId;

    if (!registeredTab.value) {
      registeredTab.value = generatedUniqueId;
    }

    const tabValue = registeredTab.value;

    target.dataset.tabValue = tabValue;
    registeredTab.variaLabelledBy = tabValue + "__item";
    registeredTab.vhidden = true;

    /* use this.querySelectorAll in all cases as this in slot */
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

        if (this._activeTabValue === registeredTab.value && this._tabHeaders.length > 0) {
          this._showTabContentForTabValue(this._tabHeaders[0].value);
        }
      }
    });

    const tab = this.tabBar.tabHeaderToTab(registeredTab);

    this._tabHeaders.splice(tabIndex, 0, tab);
    this._updateTabBarHeaders(this._tabHeaders);
    this._tabByValue[tabValue] = registeredTab;

    if (!this._activeTabValue) {
      this._activeTabValue = registeredTab.value;
    }

    if (this._activeTabValue === registeredTab.value) {
      this._selectTab(tabValue);
    }

    if (DEBUG) console.debug(CLASS_NAME, "< handleTabRegister");
  }
  
  handleTabSelected(
    event: CustomEvent
  ): void {
    if (DEBUG) console.debug(CLASS_NAME, "> handleTabSelected", JSON.stringify(event.detail));

    const selectedTabValue = event.detail.value;
    const tab = this._tabByValue[selectedTabValue];
    if (this._activeTabValue !== tab?.value) {
      this._showTabContentForTabValue(selectedTabValue);
    }

    if (DEBUG) console.debug(CLASS_NAME, "< handleTabSelected");
  }

  handleTabDataChange(
    event: CustomEvent
  ): void {

    const target = event.target as HTMLElement;
    const changedTab = event.target as SfGpsDsTabLwr;

    if (DEBUG) console.debug(CLASS_NAME, "> handleTabDataChange", changedTab.value);

    const newTabValue = changedTab.value;
    const currentTabValue = target.dataset.tabValue;
    const matchingTabHeader = this._tabHeaders.find(
      (tabHeader) => tabHeader.value === currentTabValue
    );

    if (
      currentTabValue === undefined || 
      newTabValue === undefined
    )
      return;

    if (matchingTabHeader) {
      this._updateTabHeader(matchingTabHeader, changedTab);
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

    if (DEBUG) console.debug(CLASS_NAME, "< handleTabDataChange");
  }
}
