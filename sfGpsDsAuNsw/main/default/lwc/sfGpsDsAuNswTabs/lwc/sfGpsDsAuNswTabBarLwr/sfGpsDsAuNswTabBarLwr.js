import { LightningElement, api, track } from "lwc";
import { handleKeyDownOnTabList } from "./keyboard";

export default class SfGpsDsAuNswLwrTabBar extends LightningElement {
  static renderMode = "light";

  /* api: tabHeaders, Array of Objects */

  @api
  get tabHeaders() {
    return this._tabHeaders;
  }

  set tabHeaders(tabHeaders = []) {
    this._tabHeaders = tabHeaders;
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

    let selectedTab = tabs[0];

    if (this._selectedTab) {
      selectedTab = tabs.find((tab) => tab.value === this._selectedTab.value);

      if (!selectedTab) {
        selectedTab = tabs[0];
      }
    }

    if (selectedTab) {
      this._selectedTab = selectedTab;
      selectedTab.className = this._tabClassName({ selected: true });
      selectedTab.linkClassName = "active";
      selectedTab.ariaSelected = "true";
      selectedTab.tabIndex = 0;
    }

    this._tabs = tabs;
    this._queueSynchronizeA11 = true;
  }

  @track _tabs = [];
  @track _queueSynchronizeA11 = false;

  /* getters */

  get _visibleTabs() {
    return this._tabs.filter((tab) => tab.visible);
  }

  get computedAriaOwns() {
    return this._tabs?.length
      ? this._tabs.map((item) => item.linkId).join(" ")
      : null;
  }

  /* methods */

  @api
  selectTabByValue(tabValue) {
    this._selectTab(tabValue);
  }

  @api
  focus() {
    if (!this._selectedTab) {
      return;
    }

    const tab = this.querySelector(
      `a[data-tab-value="${this._selectedTab.value}"]`
    );

    if (tab) {
      tab.focus();
    }
  }

  _findTabByValue(tabValue) {
    return this._tabs.find((tab) => tab.value === tabValue);
  }

  _selectTabAndFireSelectEvent(tabValue, options) {
    this._selectTab(tabValue, options);

    const tab = this._findTabByValue(tabValue);

    this.dispatchEvent(
      new CustomEvent("select", {
        detail: {
          value: tab.value,
          label: tab.label
        }
      })
    );
  }

  _selectTab(tabValue, options = {}) {
    const tab = this._findTabByValue(tabValue);

    if (!tab) {
      return;
    }

    if (this._selectedTab) {
      if (this._selectedTab.value === tabValue) {
        return;
      }

      this._selectedTab.hasFocus = false;
      this._selectedTab.ariaSelected = "false";
      this._selectedTab.className = this._tabClassName({});
      this._selectedTab.linkClassName = "";
      this._selectedTab.tabIndex = -1;
    }

    tab.hasFocus = true;
    tab.ariaSelected = "true";
    tab.className = this._tabClassName({
      selected: true,
      hasFocus: options.hasFocus
    });
    tab.linkClassName = "active";
    tab.tabIndex = 0;

    this._selectedTab = tab;
  }

  // eslint-disable-next-line no-unused-vars
  _tabClassName({ selected = false, hasFocus = false }) {
    /* NSW DS has no specifics for selected or focus at the tab/li level */
    return null;
  }

  _synchronizeA11y() {
    const tabLinks = this.querySelectorAll("a[role='tab']");

    tabLinks.forEach((tabLink) => {
      const tabData = this._tabs.find(
        (tab) => tabLink.getAttribute("data-tab-value") === tab.value
      );

      tabLink.setAttribute("id", tabData.linkId);
      tabLink.setAttribute("aria-controls", tabData.domId);
    });
  }

  /* event management */

  handleTabClick(event) {
    event.preventDefault();

    const clickedTabValue = event.target.getAttribute("data-tab-value");
    this._selectTabAndFireSelectEvent(clickedTabValue, { hasFocus: true });
  }

  handleBlur(event) {
    const tabValue = event.target.getAttribute("data-tab-value");
    const tab = this._findTabByValue(tabValue);

    if (tab) {
      tab.className = this._tabClassName({
        selected: this._selectedTab.value === tab.value,
        hasFocus: false
      });
    }
  }

  handleFocus(event) {
    const tabValue = event.target.getAttribute("data-tab-value");
    const tab = this._findTabByValue(tabValue);

    tab.className = this._tabClassName({
      selected: this._selectedTab.value === tab.value,
      hasFocus: true
    });
  }

  handleKeyDown(event) {
    let currentFocusedIndex = 0;

    if (this._selectedTab) {
      currentFocusedIndex = this._visibleTabs.findIndex(
        (tab) => tab.value === this._selectedTab.value
      );
    }

    handleKeyDownOnTabList(event, currentFocusedIndex, {
      totalTabs: () => this._visibleTabs.length,
      selectTabIndex: (index) => {
        const tab = this._visibleTabs[index];
        this._selectTabAndFireSelectEvent(tab.value, {
          hasFocus: true
        });

        this.querySelector(`a[data-tab-value="${tab.value}"]`).focus();
      }
    });
  }

  /* Lifecycle */

  _connected = false;

  connectedCallback() {
    this._connected = true;
  }

  renderedCallback() {
    if (this._queueSynchronizeA11) {
      this._synchronizeA11y();
      this._queueSynchronizeA11 = false;
    }
  }

  disconnectedCallback() {
    this._connected = false;
  }
}
