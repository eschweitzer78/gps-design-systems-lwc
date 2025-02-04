import { api, track } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import {
  isIPadPro,
  isArray,
  nextTick,
  uniqueId,
  normaliseBoolean
} from "c/sfGpsDsHelpers";
import { disableBodyScroll, clearAllBodyScrollLocks } from "./bodyScrollLock";

const CLOSE_MENU = "Close menu";
const CLOSE_SEARCH_LABEL = "Close search";
const LOGOUT_LABEL = "Logout";
const MENU_LABEL = "Menu";
const SEARCH_LABEL = "Search";
const TITLE_LABEL = "Main Menu";
const QUICK_EXIT_LABEL = "Quick exit";
const QUICK_EXIT_TARGET = "https://www.google.com";

const HIDEONSCROLL_DEFAULT = false;
const MENUCONTENTOPEN_DEFAULT = false;

export default class extends SfGpsDsLwc {
  static renderMode = "light";

  @api imageSrc;
  @api imageAlt;
  @api imageLink;
  @api cobrandImageSrc;
  @api cobrandImageAlt;
  @api cobrandImageLink;

  @api breakpoint = 992; // Number
  @api sticky;

  @api label = MENU_LABEL; // Menu Aria label
  @api title = TITLE_LABEL; // Menu title
  @api menuLabel = MENU_LABEL;
  @api closeMenuLabel = CLOSE_MENU;
  @api searchLabel = SEARCH_LABEL;
  @api closeSearchLabel = CLOSE_SEARCH_LABEL;
  @api logoutLabel = LOGOUT_LABEL;

  @api quickExitLabel = QUICK_EXIT_LABEL;
  @api quickExitTarget = QUICK_EXIT_TARGET;

  @api className;

  @track root = uniqueId("sf-gps-ds-au-vic-site-header-root");

  /* api: hideOnScroll Boolean */

  _hideOnScroll = HIDEONSCROLL_DEFAULT;
  _hideOnScrollOriginal = HIDEONSCROLL_DEFAULT;

  @api
  get hideOnScroll() {
    return this._hideOnScrollOriginal;
  }

  set hideOnScroll(value) {
    this._hideOnScrollOriginal = value;
    this._hideOnScroll = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: HIDEONSCROLL_DEFAULT
    });
  }

  /* api: menuContentOpen Boolean */

  _menuContentOpen = MENUCONTENTOPEN_DEFAULT;
  _menuContentOpenOriginal = MENUCONTENTOPEN_DEFAULT;

  @api
  get isMenuContentOpen() {
    return this._menuContentOpenOriginal;
  }

  set isMenuContentOpen(value) {
    this._menuContentOpenOriginal = value;
    this._menuContentOpen = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: MENUCONTENTOPEN_DEFAULT
    });

    this.toggleBodyScroll();
  }

  get isMenuContentClosed() {
    return !this.isMenuContentOpen;
  }

  /* api: navItems, array of navigation item objects { url, text, subNav } */

  _navItems;
  _navItemsOriginal;

  @api
  get navItems() {
    return this._navItemsOriginal;
  }

  set navItems(items) {
    this._navItemsOriginal = items;
    this.navItemsMapping();
  }

  /* tracked */

  @track menuLayout = "vertical";
  @track searchState = "closed";
  @track menuState = "closed";
  @track lastRootMenuClicked = -1;
  @track headerVisible = true;
  @track lastScrollTop = 0;
  @track stickyActive = false;
  @track offsetTop = 0;
  @track menuWideEnabled = null;

  /* computed */

  get menuButton() {
    return {
      opened: {
        text: this.closeMenuLabel,
        icon: "close"
      },
      closed: {
        text: this.menuLabel,
        icon: "hamburger"
      }
    };
  }

  get searchButton() {
    return {
      opened: {
        text: this.closeSearchLabel,
        icon: "close"
      },
      closed: {
        text: this.searchLabel,
        icon: "search"
      }
    };
  }

  get logoutButton() {
    return {
      text: this.logoutLabel,
      icon: "link"
    };
  }

  get showSearch() {
    return this.searchLabel;
  }

  get showLogout() {
    return this.logoutLabel;
  }

  get computedSiteHeaderClassName() {
    return {
      "rpl-site-header": true,
      "rpl-site-header--open": this.isMenuContentOpen,
      "rpl-site-header--sticky": this.stickyActive
    };
  }

  get computedMenuButtonClassName() {
    return {
      "rpl-site-header__btn": true,
      "rpl-site-header__btn--menu": true,
      "rpl-site-header__btn--menu-open": this.isMenuOpen
    };
  }

  get computedDividerVicClassName() {
    return {
      "rpl-site-header__divider": true,
      "rpl-site-header__divider--vic": true,
      [this.dividerStateClassName]: this.dividerStateClassName
    };
  }

  get computedLogoContainerClassName() {
    return {
      "rpl-site-header__title": true,
      "rpl-site-header__logo-container--vic-logo-primary": true,
      "rpl-site-header__logo-container--vic-logo-primary--cobrand":
        this.cobrandImageSrc
    };
  }

  get computedDividerCobrandClassName() {
    return {
      "rpl-site-header__divider": true,
      "rpl-site-header__divider--cobrand": true,
      [this.dividerStateClassName]: this.dividerStateClassName
    };
  }

  get computedMenuContainerClassName() {
    return {
      "rpl-site-header__menu-container": true,
      "rpl-site-header__menu-container--horizontal":
        this.menuLayout === "horizontal",
      "rpl-site-header__menu-container--vertical":
        this.menuLayout === "vertical"
    };
  }

  get computedLogoutButtonClassName() {
    return {
      "rpl-site-header__btn": true,
      "rpl-site-header__btn--logout": true,
      "rpl-site-header__btn--logout-open": this.isMenuOpen
    };
  }

  get computedSearchButtonClassName() {
    return {
      "rpl-site-header__btn": true,
      "rpl-site-header__btn--search": true,
      "rpl-site-header__btn--search-open": this.isSearchOpen
    };
  }

  get showSearchContainer() {
    return this.isMenuContentOpen && this.isSearchOpen;
  }

  get isSearchOpen() {
    return this.searchState === "opened";
  }

  get isMenuOpen() {
    return this.menuState === "opened";
  }

  get activeMenuButton() {
    return this.menuButton[this.menuState];
  }

  get activeSearchButton() {
    return this.searchButton[this.searchState];
  }

  get isMenuContainerVisible() {
    return (
      this.searchState === "closed" &&
      ((this.isMenuContentOpen && this.isMenuOpen) ||
        this.menuLayout === "horizontal")
    );
  }

  get isVicLogoVisible() {
    return !this.isMenuContentOpen && this.imageSrc;
  }

  get isCobrandVisible() {
    return !this.isMenuContentOpen && this.cobrandImageSrc;
  }

  get dividerStateClassName() {
    const hasMenu = this.showMenuButton ? "1" : "0";
    const hasVic = this.isVicLogoVisible ? "1" : "0";
    const hasCobrand = this.isCobrandVisible ? "1" : "0";

    return `rpl-site-header__divider--${hasMenu}${hasVic}${hasCobrand}`;
  }

  _searchContainerId;

  get computedSearchContainerId() {
    if (!this._searchContainerId) {
      this._searchContainerId = uniqueId(
        "sf-gps-ds-au-vic-site-header-search-container"
      );
    }

    return this._searchContainerId;
  }

  get showMenuButton() {
    const menuLinkCount = isArray(this._navItems) && this._navItems.length > 0;

    if (
      this.menuState === "opened" &&
      this.searchState !== "opened" &&
      menuLinkCount
    ) {
      return true;
    }

    return this.menuLayout === "vertical" && this.searchState !== "opened";
  }

  /* methods */

  toggleBodyScroll() {
    if (this.isMenuContentOpen) {
      nextTick(() => {
        const menuEl = this.querySelector(".rpl-site-header__menu-container");

        if (menuEl) {
          disableBodyScroll(menuEl);
        }
      });
    } else {
      clearAllBodyScrollLocks();
    }
  }

  windowResize() {
    // TODO consider using resizeObserver
    let w = window.innerWidth || document.documentElement.clientWidth;

    if (
      !isIPadPro() &&
      w >= this.breakpoint &&
      (this.menuWideEnabled || this.menuWideEnabled === null)
    ) {
      // Desktop.
      this.menuWideEnabled = false;
      this.menuLayout = "horizontal";

      // Close menu on vertical -> horizontal: avoids incorrect display if vertical is on root.
      if (this.menuState === "opened" && this.isMenuContentOpen) {
        this.menuState = "closed";
        // eslint-disable-next-line @lwc/lwc/no-api-reassignments
        this.isMenuContentOpen = false;
        this.closeAllMenus();
      }
    } else if (
      w < this.breakpoint &&
      (!this.menuWideEnabled || this.menuWideEnabled === null)
    ) {
      // Mobile.
      this.menuWideEnabled = true;
      this.menuLayout = "vertical";
    }
  }

  closeAllMenus() {
    this.navItemsMapping();
  }

  openMenu(index) {
    this._navItems = this._navItems.map((entry) => ({
      ...entry,
      open: entry.index === index
    }));
  }

  scroll() {
    let rootElement = this.refs.siteheader;
    let scrollTop = window.scrollY || document.documentElement.scrollTop;

    if (this.stickyActive === false && scrollTop > rootElement.offsetTop) {
      //this.$el.offsetTop) {
      this.offsetTop = rootElement.offsetTop; // reserve the offsetTop
      this.stickyActive = true; // When scroll header to top, make header sticky
    } else if (this.stickyActive === true && scrollTop > this.offsetTop) {
      // was >
      this.stickyActive = true;
    } else {
      this.stickyActive = false;
    }

    if (scrollTop > this.lastScrollTop && this.stickyActive) {
      // scroll down and is sticky
      this.headerVisible = false;
    } else {
      // scroll up or is not sticky
      this.headerVisible = true;
    }

    this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }

  _mapItems;

  navItemsMapping() {
    let map = {};
    this._navItems = this._navItemsOriginal
      ? this.mapItems("navitem", 0, map, this._navItemsOriginal)
      : null;
    this._mapItems = map;
  }

  mapItems(parentIndex, parentLevel, map, items) {
    let index = 0;

    return items.map((item) => {
      let result = {
        ...item,
        index: item.index || `${parentIndex}-${index++}`,
        level: parentLevel + 1,
        open: false,
        displayAsLink: true
      };

      if (result.subNav) {
        result.children = this.mapItems(
          result.index,
          parentLevel + 1,
          map,
          item.subNav
        );

        result.displayAsLink = result.level === 4;

        delete result.subNav;
      }

      map[result.index] = result;
      return result;
    });
  }

  /* event management */

  handleSearchClick() {
    // eslint-disable-next-line @lwc/lwc/no-api-reassignments
    this.isMenuContentOpen = !(
      this.isMenuContentOpen && this.searchState === "opened"
    );
    this.searchState = this.isMenuContentOpen ? "opened" : "closed";
    this.menuState = "closed";

    // TODO
    // this.dispatchEvent(new CustomEvent("search", { detail: this.searchTerms }));
  }

  handleRootMenuClicked(event) {
    let rootMenuIndex = event.detail.index;

    // eslint-disable-next-line @lwc/lwc/no-api-reassignments
    this.isMenuContentOpen = !(
      this.isMenuContentOpen && this.lastRootMenuClicked === rootMenuIndex
    );
    this.menuState = this.isMenuContentOpen ? "opened" : "closed";
    this.lastRootMenuClicked = rootMenuIndex;

    if (!this.isMenuContentOpen) {
      this.closeAllMenus();
    } else {
      this.closeAllMenus();
      this.openMenu(rootMenuIndex);
    }
  }

  handleNavigate(event) {
    // eslint-disable-next-line @lwc/lwc/no-api-reassignments
    this.isMenuContentOpen = false;
    this.menuState = "closed";
    this.closeAllMenus();

    this.dispatchEvent(
      new CustomEvent("navigate", {
        detail: event.detail
      })
    );
  }

  handleMenuClick() {
    // eslint-disable-next-line @lwc/lwc/no-api-reassignments
    this.isMenuContentOpen = !(
      this.isMenuContentOpen && this.menuState === "opened"
    );
    this.searchState = "closed";
    this.menuState = this.isMenuContentOpen ? "opened" : "closed";

    if (!this.isMenuContentOpen) {
      this.closeAllMenus();
    }
  }

  handleImageClick() {
    if (!this.imageLink) {
      this.dispatchEvent(new CustomEvent("imageclick"));
    }
  }

  handleCobrandImageClick() {
    if (!this.cobrandImageLink) {
      this.dispatchEvent(new CustomEvent("cobrandimageclick"));
    }
  }

  handleLogoutClick() {
    this.dispatchEvent(new CustomEvent("logout"));
  }

  handleKeyDown(event) {
    if (event.keyCode === 27) {
      this.closeModalMenu();
    }
  }

  /* lifecycle */

  _windowsResizeFunc;
  _scrollFunc;

  connectedCallback() {
    this._windowsResizeFunc = this.windowResize.bind(this);
    window.addEventListener("resize", this._windowsResizeFunc);
    this.windowResize();

    if (this.hideOnScroll) {
      this._scrollFunc = this.scroll.bind(this);
      window.addEventListener("scroll", this._scrollFunc);
    }
  }

  disconnectedCallback() {
    window.removeEventListener("resize", this._windowsResizeFunc);
    this._windowsResizeFunc = null;

    clearAllBodyScrollLocks();

    if (this.hideOnScroll) {
      window.removeEventListener("scroll", this._scrollFunc);
      this._scrollFunc = null;
    }
  }
}
