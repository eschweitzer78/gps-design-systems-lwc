import { LightningElement, api } from "lwc";
import { uniqueId, computeClass, normaliseString } from "c/sfGpsDsHelpers";
import individualTmpl from "./sfGpsDsAuQldTabs.html";

const TAB_PREFIX = "tab";

const MODE_INDIVIDUAL = "individual";
const MODE_SECTION = "section";

const MODE_VALUES = [MODE_INDIVIDUAL, MODE_SECTION];
const MODE_DEFAULT = MODE_INDIVIDUAL;

const DEBUG = false;
const CLASS_NAME = "SfGpsDsAuQldTabs";

export default class extends LightningElement {
  static renderMode = "light";

  @api cstyle;
  @api width;
  @api title;
  @api className;
  @api tabClassName;
  @api containerClassName;

  /* api: mode */

  _mode = MODE_DEFAULT;
  _modeOriginal = MODE_DEFAULT;

  @api
  get mode() {
    return this._modeOriginal;
  }

  set mode(value) {
    this._modeOriginal = value;
    this._mode = normaliseString(value, {
      validValues: MODE_VALUES,
      fallbackValue: MODE_DEFAULT
    });
  }

  /* api: activeTabValue */

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
      qld__body: true,
      "qld__body--full-with": true,
      "qld__tab-section": true,
      [this.className]: !!this.className
    };
  }

  get computedBodyClassName() {
    return computeClass({
      "qld__tab-section": true,
      [this.className]: !!this.className
    });
  }

  get computedContainerClassName() {
    return {
      "qld__tab-container": true,
      "qld__tab-container__fixed": true,
      [this.containerClassName]: !!this.containerClassName
    };
  }

  /* methods */

  handleTabRegister(event) {
    if (DEBUG) console.debug(CLASS_NAME, "> handleTabRegister", event.target);

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

    if (DEBUG) console.debug(CLASS_NAME, "< handleTabRegister");
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
    if (DEBUG)
      console.debug(
        CLASS_NAME,
        "> handleTabSelected",
        JSON.stringify(event.detail)
      );

    const selectedTabValue = event.detail.value;
    const tab = this._tabByValue[selectedTabValue];
    if (this._activeTabValue !== tab.value) {
      this._showTabContentForTabValue(selectedTabValue);
    }

    if (DEBUG) console.debug(CLASS_NAME, "< handleTabSelected");
  }

  handleTabDataChange(event) {
    if (DEBUG) console.debug(CLASS_NAME, "> handleTabDataChange", event.target);

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

    if (DEBUG) console.debug(CLASS_NAME, "< handleTabDataChange");
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

  render() {
    return individualTmpl;
  }
}
