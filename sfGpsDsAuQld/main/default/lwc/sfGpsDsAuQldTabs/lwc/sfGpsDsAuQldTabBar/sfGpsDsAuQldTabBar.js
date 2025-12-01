import { LightningElement, api, track } from "lwc";
import { handleKeyDownOnTabList } from "./keyboard";
import { computeClass } from "c/sfGpsDsHelpers";
import OnWindowResize from "c/sfGpsDsOnWindowResize";
import sfGpsDsAuQldStaticResource from "@salesforce/resourceUrl/sfGpsDsAuQld";

const STATIC_RESOURCE_ICONS_PATH =
  sfGpsDsAuQldStaticResource + "/assets/img/QLD-icons.svg";

const I18N = {
  scrollLeft: "Scroll tab buttons left",
  scrollRight: "Scroll tab buttons right"
};
const SCROLL_AMOUNT = 500;

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuQldTabBar";

export default class extends LightningElement {
  static renderMode = "light";

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
        iconUrl: STATIC_RESOURCE_ICONS_PATH + "#" + tab.iconName,
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
    this._hasOverflow = null; // force recalculation
  }

  /* computed */

  get computedClassName() {
    return {
      qld__tabs: true,
      [this.className]: this.className
    };
  }

  get _visibleTabs() {
    return this._tabs.filter((tab) => tab.visible);
  }

  get i18n() {
    return I18N;
  }

  get computedChevronLeftIconUrl() {
    return STATIC_RESOURCE_ICONS_PATH + "#chevron-left";
  }

  get computedChevronRightIconUrl() {
    return STATIC_RESOURCE_ICONS_PATH + "#chevron-right";
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

    if (tab) {
      this.dispatchEvent(
        new CustomEvent("select", {
          detail: {
            value: tab.value,
            label: tab.label
          }
        })
      );
    } else {
      if (DEBUG)
        console.debug(
          CLASS_NAME,
          "= _selectTabAndFireSelectEvent",
          "could not find tab"
        );
    }

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

  checkOverflow() {
    if (DEBUG) console.debug(CLASS_NAME, "> checkOverflow", this._hasOverflow);

    if (this._hasOverflow != null || !this.refs) return;

    const cusidEle = this.querySelectorAll(".qld__tab-button");
    const tabList = this.refs.tabList;
    const menuWidth = tabList.offsetWidth;
    let totalWidth = 0;

    // Calculate the total width of all the nav items
    for (let i = 0; i < cusidEle.length; i++) {
      totalWidth += cusidEle[i].offsetWidth;
    }

    if (DEBUG) {
      console.debug(
        CLASS_NAME,
        "= checkOverflow",
        "menuWidth=",
        menuWidth,
        "totalWidth=",
        totalWidth
      );
    }

    // If the total width is greater than the menu width, display the right scroll button
    // and scroll the link list to the left by the defined amount
    if (totalWidth > menuWidth) {
      this.refs.scrollRightBtn.style.display = "block";
      tabList.scrollLeft -= SCROLL_AMOUNT;
      this.refs.scrollLeftBtn.style.display = "none";
      this._hasOverflow = true;
    } else {
      this.refs.scrollLeftBtn.style.display = "none";
      tabList.scrollLeft = 0;
      this.refs.scrollRightBtn.style.display = "none";
      this._hasOverflow = false;
    }

    if (DEBUG) console.debug(CLASS_NAME, "< checkOverflow", this._hasOverflow);
  }

  // eslint-disable-next-line no-unused-vars
  computeTabClassName({ selected = false, hasFocus = false }) {
    return computeClass({
      "qld__tab-button": true,
      active: selected
    });
  }

  /* event management */

  handleTabClick(event) {
    if (DEBUG)
      console.debug(CLASS_NAME, "> handleTabClick", event.currentTarget);

    event.preventDefault();

    const clickedTabValue = event.currentTarget.getAttribute("data-tab-value");

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

  handleScrollRight() {
    const tabList = this.refs.tabList;

    // Check if the current scroll position is at the maximum scroll position
    if (
      tabList.scrollLeft + SCROLL_AMOUNT >=
      tabList.scrollWidth - tabList.clientWidth
    ) {
      // Hide the scroll right button
      this.refs.scrollRightBtn.style.display = "none";
    }

    tabList.scrollLeft += SCROLL_AMOUNT;
    this.refs.scrollLeftBtn.style.display = "block";
  }

  handleScrollLeft() {
    const tabList = this.refs.tabList;

    // Check if the current scroll position is at the beginning of the scroll
    if (tabList.scrollLeft - SCROLL_AMOUNT <= 0) {
      // Hide the scroll left button
      this.refs.scrollLeftBtn.style.display = "none";
    }

    tabList.scrollLeft -= SCROLL_AMOUNT;
    this.refs.scrollRightBtn.style.display = "block";
  }

  /* lifecycle */

  _hasOverflow = false;
  _onWindowResize;

  connectedCallback() {
    if (!this._onWindowResize) {
      this._onWindowResize = new OnWindowResize();
      this._onWindowResize.bind(() => {
        if (DEBUG) console.debug(CLASS_NAME, "onWindowResize");
        // Force recalculation of overflow
        this._hasOverflow = null;
        this.checkOverflow();
      });
    }
  }

  disconnectedCallback() {
    if (this._onWindowResize) {
      this._onWindowResize.unbind();
    }

    if (this._onClickOutside) {
      this._onClickOutside.unbind(this, "containerRef");
    }
  }

  renderedCallback() {
    this.checkOverflow();
  }
}
