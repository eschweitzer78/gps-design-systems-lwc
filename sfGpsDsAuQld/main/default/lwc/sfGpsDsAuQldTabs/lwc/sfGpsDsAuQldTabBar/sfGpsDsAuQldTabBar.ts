import { api } from "lwc";
import SfGpsDsTabBarLwr from "c/sfGpsDsTabBarLwr";
import OnWindowResize from "c/sfGpsDsOnWindowResize";
import sfGpsDsAuQldStaticResource from "@salesforce/resourceUrl/sfGpsDsAuQld";
import { computeClass } from "c/sfGpsDsHelpers";

import type { TabHeader, Tab } from "c/sfGpsDsAuQldTabBar";

const STATIC_RESOURCE_ICONS_PATH =
  sfGpsDsAuQldStaticResource + "/assets/img/QLD-icons.svg";

const I18N = {
  scrollLeft: "Scroll tab buttons left",
  scrollRight: "Scroll tab buttons right"
};
const SCROLL_AMOUNT = 500;

const DEBUG = false;
const CLASS_NAME = "sfGpsDsAuQldTabBar";

export default 
class SfGpsDsAuQldTabBar 
extends SfGpsDsTabBarLwr {
  static renderMode: "light" | "shadow" = "light";

  get _isLightDOM() {
    return true;
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
  
  // @ts-ignore
  @api
  tabHeaderToTab(
    tab: TabHeader
  ): Tab {
    if (DEBUG) console.debug(CLASS_NAME, "> tabHeaderToTab", tab);

    let rv = super.tabHeaderToTab(tab) as Tab;

    rv.iconName = tab.iconName;
    rv.iconUrl = STATIC_RESOURCE_ICONS_PATH + "#" + tab.iconName;

    this._hasOverflow = null; // force recalculation

    if (DEBUG) console.debug(CLASS_NAME, "< tabHeaderToTab", rv);
    return rv;
  }

  // eslint-disable-next-line no-unused-vars
  _tabClassName(options?: { selected?: boolean, hasFocus?: boolean }): string | undefined {
    return computeClass({
      "qld__tab-button": true,
      active: options?.selected
    });
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
      const el = cusidEle[i] as HTMLElement;
      totalWidth += el.offsetWidth;
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
  _onWindowResize: OnWindowResize;

  constructor() {
    super();

    this.handleBeforeMount(() => {
      this._onWindowResize = new OnWindowResize();
      this._onWindowResize.bind(() => {
        if (DEBUG) console.debug(CLASS_NAME, "onWindowResize");
        // Force recalculation of overflow
        this._hasOverflow = null;
        this.checkOverflow();
      });
    });

    this.handleBeforeUnmount(() => {
      if (this._onWindowResize) {
        this._onWindowResize.unbind();
      }
    });
  }

  renderedCallback(): void {
    super.renderedCallback();
    this.checkOverflow();
  }
}
