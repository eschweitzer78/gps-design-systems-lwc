import { LightningElement, api } from "lwc";
import { uniqueId } from "c/sfGpsDsHelpers";

const TAB_PREFIX = "tab";

export default class extends LightningElement {
  static renderMode = "light";

  @api title;
  @api mode; // vertical or horizontal
  @api className;
  @api tabClassName;

  _tabByValue = {};
  _tabHeaders = [];

  _activeTabValue;

  @api
  get activeTabValue() {
    return this._activeTabValue;
  }

  set activeTabValue(tabValue) {
    const newTabValue = tabValue && String(tabValue);
    if (!newTabValue || this._activeTabValue === newTabValue) {
      return;
    }

    if (this._connected) {
      const tab = this._tabByValue[tabValue];
      if (tab) {
        this._selectTab(tabValue);
      }
    } else {
      this._activeTabValue = newTabValue;
    }
  }

  get computedClassName() {
    return {
      "sfgpsdsauvic2-tabs-vertical": this.mode === "vertical",
      [this.className]: this.className
    };
  }

  handleTabRegister(event) {
    event.stopPropagation();

    const tab = event.target;
    tab.className = this.tabClassName;

    const generatedUniqueId = uniqueId(TAB_PREFIX);
    tab.vid = generatedUniqueId;

    if (!tab.value) {
      tab.value = generatedUniqueId;
    }

    const tabValue = tab.value;

    tab.dataTabValue = tabValue;
    tab.variaLabelledBy = tabValue + "__item";
    tab.vhidden = true;

    const tabs = this.querySelectorAll(`[role="tabpanel"]`);
    let tabIndex;

    for (tabIndex = 0; tabIndex < tabs.length; tabIndex++) {
      if (tabs[tabIndex].dataTabValue === tabValue) {
        break;
      }
    }

    event.detail.setDeregistrationCallback(() => {
      if (!this._connected) {
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
      iconName: tab.iconName,
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

  _selectTab(value) {
    this._selectTabHeaderByTabValue(value);
    this._showTabContentForTabValue(value);
  }

  _showTabContentForTabValue(value) {
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

  _selectTabHeaderByTabValue(value) {
    if (!this._connected) {
      return;
    }

    const tabBar = this.refs.bar;
    tabBar.selectTabByValue(value);
  }

  handleTabSelected(event) {
    const selectedTabValue = event.detail.value;
    const tab = this._tabByValue[selectedTabValue];
    if (this._activeTabValue !== tab.value) {
      this._showTabContentForTabValue(selectedTabValue);
    }
  }

  handleTabDataChange(event) {
    const changedTab = event.target;
    const newTabValue = changedTab.value;
    const currentTabValue = changedTab.dataTabValue;
    const matchingTabHeader = this._tabHeaders.find(
      (tabHeader) => tabHeader.value === currentTabValue
    );

    if (matchingTabHeader) {
      matchingTabHeader.label = changedTab.label;
      matchingTabHeader.iconName = changedTab.iconName;
      matchingTabHeader.value = newTabValue;
      matchingTabHeader.title = changedTab.title;
      matchingTabHeader.showErrorIndicator = changedTab.showErrorIndicator;
    }

    this._updateTabBarHeaders(this._tabHeaders);

    if (currentTabValue !== newTabValue) {
      const tab = this._tabByValue[currentTabValue];

      if (tab) {
        tab.dataTabValue = newTabValue;
        this._tabByValue[newTabValue] = this._tabByValue[currentTabValue];

        this._tabByValue[currentTabValue] = undefined;
      }

      if (this._activeTabValue === currentTabValue) {
        this._activeTabValue = newTabValue;
      }
    }
  }

  _updateTabBarHeaders(headers) {
    this.refs.bar.tabHeaders = headers.slice();
  }

  @api
  focus() {
    this.refs.bar.focus();
  }

  /* Lifecycle */

  _connected = false;

  connectedCallback() {
    this._connected = true;
  }

  disconnectedCallback() {
    this._connected = false;
  }
}
