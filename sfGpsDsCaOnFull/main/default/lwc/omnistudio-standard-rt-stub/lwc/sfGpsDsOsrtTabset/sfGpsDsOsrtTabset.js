import { LightningElement, track, api } from "lwc";
import pubsub from "c/sfGpsDsOsrtPubsub";

import sldsTemplate from "./tabset_slds.html";
import ndsTemplate from "./tabset_nds.html";

let idGenerator = 0;

export default class Tabs extends LightningElement {
  @api set activeTabValue(value) {
    if (!Number.isNaN(value)) {
      this._activeTabValue = parseInt(value, 10);
    }
  }
  get activeTabValue() {
    return this._activeTabValue;
  }
  @api variant = "default";

  tabs = [];
  @track _tabs = [];
  @api theme = "slds";
  @api lazyLoad = false;
  @track _activeTabValue = 0;
  @api hideTabNav = false;
  @api headerclass;

  isFirstRender = true;
  tabLength = 0;

  get tabButtons() {
    const tabsLiEles =
      this.template && this.template.querySelectorAll("[role=tablist]>li");
    return tabsLiEles && [].slice.call(tabsLiEles);
  }

  renderedCallback() {
    if (this.isFirstRender) {
      const tabsLiEles = [];
      let tabsList = this.querySelectorAll(".vlocity-base-tab");
      this.tabLength = tabsList.length;
      this.pubsubEvent = {
        showtab: this.showtab
      };
      tabsList.forEach((tab) => {
        if (!this.lazyLoad) {
          tab.showTab = tab.displayTab;
        }
        tab.variant = this.variant;
        tab.theme = this.theme;
        this.tabs.push(tab);
        tabsLiEles.push({
          id: "tab-" + idGenerator++,
          label: tab.label,
          title: tab.title,
          iconName: tab.iconName,
          iconText: tab.iconAssertiveText,
          iconUrl: tab.iconUrl,
          isIcon: tab.iconName ? true : false,
          displayTab: tab.displayTab,
          tabIndex: -1,
          tabId: tab.tabId
        });
        pubsub.register(tab.label, this.pubsubEvent);
      });
      this._tabs = [].slice.call(tabsLiEles);
      this.updateTabActive();
      this.isFirstRender = false;
    }
  }

  showtab = (data) => {
    this._tabs.forEach((ele) => {
      if (ele.label === data.label) {
        ele.displayTab = data.displayTab;
      }
    });
  };

  updateTabActive() {
    const tabButtons = this.tabButtons;
    this.tabs.forEach((ele, index) => {
      if (index === parseInt(this.activeTabValue, 10)) {
        if (this.lazyLoad) {
          ele.setShowTab(true);
        }
        ele.classList.remove(`${this.theme}-hide`);
        ele.classList.add(`${this.theme}-show`);
        if (tabButtons && tabButtons[index]) {
          tabButtons[index].classList.add(`${this.theme}-is-active`);
          tabButtons[index]
            .querySelector("a")
            .setAttribute("aria-selected", true);
          tabButtons[index].querySelector("a").setAttribute("tabIndex", 0);
          tabButtons[index].querySelector("a").focus();
        }
      } else {
        ele.classList.remove(`${this.theme}-show`);
        ele.classList.add(`${this.theme}-hide`);
        if (tabButtons && tabButtons[index]) {
          tabButtons[index].classList.remove(`${this.theme}-is-active`);
          tabButtons[index]
            .querySelector("a")
            .setAttribute("aria-selected", false);
          tabButtons[index].querySelector("a").setAttribute("tabIndex", -1);
        }
      }
    });
  }

  render() {
    if (this.theme === "nds") {
      return ndsTemplate;
    }
    return sldsTemplate;
  }

  get getMainContainerClass() {
    return this.variant === "vertical"
      ? `${this.theme}-vertical-tabs`
      : `vloc-tab ${this.theme}-col ${this.theme}-grid ${this.theme}-grid_vertical ${this.theme}-tabs_${this.variant}`;
  }

  get getTabNavClass() {
    return this.variant === "vertical"
      ? `${this.theme}-vertical-tabs__nav`
      : `${this.theme}-tabs_${this.variant}__nav`;
  }

  get getTabItemClass() {
    return this.variant === "vertical"
      ? `${this.theme}-vertical-tabs__nav-item`
      : `${this.theme}-tabs_${this.variant}__item`;
  }

  get getTabLinkClass() {
    return this.variant === "vertical"
      ? `${this.theme}-vertical-tabs__link`
      : `${this.theme}-tabs_${this.variant}__link`;
  }

  get getTabHeaderClass() {
    return `${this.theme}-truncate ${this.headerclass ? this.headerclass : ""}`;
  }

  handleChangeTab(evt) {
    const index = evt.currentTarget.dataset.selectedIndex;
    const tabId = evt.currentTarget.dataset.selectedTab;

    this._activeTabValue = parseInt(index, 10);
    let tabInfo = {
      tabIndex: this._activeTabValue
    };
    if (tabId) {
      tabInfo.id = tabId;
    }
    this.updateTabActive();
    this.fireEvent("tabchange", tabInfo);
  }

  handleKeyEvent(eve) {
    const keyCodeEnum = {
      LEFT: 37,
      RIGHT: 39
    };
    if (eve.keyCode !== keyCodeEnum.LEFT && eve.keyCode !== keyCodeEnum.RIGHT) {
      return;
    }

    if (eve.keyCode === keyCodeEnum.LEFT) {
      this._activeTabValue =
        this.activeTabValue !== 0
          ? this.activeTabValue - 1
          : this.tabLength - 1;
    } else if (eve.keyCode === keyCodeEnum.RIGHT) {
      this._activeTabValue =
        this.activeTabValue === this.tabLength - 1
          ? 0
          : this.activeTabValue + 1;
    }

    this.updateTabActive();
  }

  fireEvent(eventName, data) {
    let event = new CustomEvent(eventName, {
      bubbles: true,
      composed: true,
      detail: {
        result: data || ""
      }
    });
    this.dispatchEvent(event);
  }

  updateValue(event) {
    if (event) {
      event.stopPropagation();
    }
    let data = event.detail;
    if (data.tabId && data.obj) {
      this._tabs = this._tabs.map((tab) => {
        if (tab.tabId === data.tabId) {
          tab[data.obj.key] = data.obj.value;
        }
        return tab;
      });
    }
  }
  disconnectedCallback() {
    let tabsList = this.querySelectorAll(".vlocity-base-tab");
    tabsList.forEach((tab) => {
      pubsub.unregister(tab.label, this.pubsubEvent);
    });
  }
}
