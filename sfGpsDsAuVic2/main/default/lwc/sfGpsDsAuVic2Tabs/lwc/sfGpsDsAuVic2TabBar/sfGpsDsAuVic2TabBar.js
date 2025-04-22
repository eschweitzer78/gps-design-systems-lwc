import { LightningElement, api, track } from "lwc";
import { handleKeyDownOnTabList } from "./keyboard";
import { computeClass } from "c/sfGpsDsHelpers";

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuVic2TabBar";

export default class extends LightningElement {
  static renderMode = "light";

  @api mode;
  @api className;

  /* api: tabHeaders */

  @track _tabs = [];

  @api
  get tabHeaders() {
    return this._tabHeaders;
  }

  set tabHeaders(tabHeaders = []) {
    this._tabHeaders = tabHeaders;
    const tabs = tabHeaders.map((tab) => {
      const className = this.computeTabClassName({});

      return {
        label: tab.label,
        iconName: tab.iconName,
        title: tab.title || tab.label,
        linkId: tab.value + "__item",
        domId: tab.domId,
        value: String(tab.value),
        className,
        tabIndex: -1,
        ariaSelected: false,
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
      selectedTab.className = this.computeTabClassName({ selected: true });
      selectedTab.ariaSelected = true;
      selectedTab.tabIndex = 0;
    }

    this._tabs = tabs;
  }

  /* computed */

  get computedClassName() {
    return {
      "rpl-tabs": true,
      "rpl-tabs--vertical": this.mode === "vertical",
      [this.className]: this.className
    };
  }

  get _visibleTabs() {
    return this._tabs.filter((tab) => tab.visible);
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
      `[data-tab-value="${this._selectedTab.value}"]`
    );

    if (tab) {
      tab.focus();
    }
  }

  _findTabByValue(tabValue) {
    return this._tabs.find((tab) => tab.value === tabValue);
  }

  _selectTabAndFireSelectEvent(tabValue, options) {
    if (DEBUG) {
      console.debug(
        CLASS_NAME,
        "> _selectTabAndFireSelectEvent",
        "tabValue",
        tabValue,
        "options",
        JSON.stringify(options)
      );
    }

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

    if (DEBUG) console.debug(CLASS_NAME, "< _selectTabAndFireSelectEvent");
  }

  _selectTab(tabValue, options = {}) {
    if (DEBUG) {
      console.debug(
        CLASS_NAME,
        "> _selectTab",
        "tabValue",
        tabValue,
        "options",
        JSON.stringify(options)
      );
    }

    const tab = this._findTabByValue(tabValue);

    if (!tab) {
      return;
    }

    if (this._selectedTab) {
      if (this._selectedTab.value === tabValue) {
        if (DEBUG) console.debug(CLASS_NAME, "< _selectTab already selected");
        return;
      }

      this._selectedTab.hasFocus = false;
      this._selectedTab.ariaSelected = false;
      this._selectedTab.className = this.computeTabClassName({});
      this._selectedTab.tabIndex = -1;
    }

    tab.hasFocus = true;
    tab.ariaSelected = true;
    tab.className = this.computeTabClassName({
      selected: true,
      hasFocus: options.hasFocus
    });
    tab.tabIndex = 0;

    this._selectedTab = tab;

    if (DEBUG) {
      console.debug(
        CLASS_NAME,
        "< _selectTab default",
        "_tabs",
        JSON.stringify(this._tabs)
      );
    }
  }

  /* event management */

  handleTabClick(event) {
    if (DEBUG) console.debug(CLASS_NAME, "> handleTabClick");
    event.preventDefault();

    const clickedTabValue = event.target.getAttribute("data-tab-value");

    if (DEBUG)
      console.debug(
        CLASS_NAME,
        "= handleTabClick",
        "clickedTabValue",
        clickedTabValue
      );

    this._selectTabAndFireSelectEvent(clickedTabValue, { hasFocus: true });

    if (DEBUG) console.debug(CLASS_NAME, "< handleTabClick");
  }

  handleBlur(event) {
    const tabValue = event.target.getAttribute("data-tab-value");
    const tab = this._findTabByValue(tabValue);

    if (tab) {
      tab.className = this.computeTabClassName({
        selected: this._selectedTab.value === tab.value,
        hasFocus: false
      });
    }
  }

  handleFocus(event) {
    const tabValue = event.target.getAttribute("data-tab-value");
    const tab = this._findTabByValue(tabValue);

    tab.className = this.computeTabClassName({
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

        this.querySelector(`[data-tab-value="${tab.value}"]`).focus();
      }
    });
  }

  // eslint-disable-next-line no-unused-vars
  computeTabClassName({ selected = false, hasFocus = false }) {
    return computeClass({
      "rpl-tab": true,
      "rpl-tab--active": selected,
      "rpl-type-p": true,
      "rpl-u-focusable-block": true
    });
  }
}
