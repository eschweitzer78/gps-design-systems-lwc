import { api, track } from "lwc";
import SfGpsDsLwc from "c/sfGpsDsLwc";
import { isIPadPro, computeClass, nextTick, uniqueId } from "c/sfGpsDsHelpers";
import { disableBodyScroll, clearAllBodyScrollLocks } from "./bodyScrollLock";

const CLOSE_MENU = "Close menu";
const CLOSE_SEARCH_LABEL = "Close search";
const LOGOUT_LABEL = "Logout";
const MENU_LABEL = "Menu";
const SEARCH_LABEL = "Search";
const TITLE_LABEL = "Main Menu";
const QUICK_EXIT_LABEL = "Quick exit";
const QUICK_EXIT_TARGET = "https://www.google.com";

export default class SfGpsDsAuVicSiteHeader extends SfGpsDsLwc {
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

  /**
   * An array of LinkDescription objects:
   *
   * ```
   * {
   *   url: string,
   *   text: string,
   *   target?: string,
   *   children: LinkDescription[]  -> subNav
   * }
   * ```
   *
   * - `url` is the link
   * - `text` is the display text,
   * - `target` is used for the `target` attribute
   * - `children` describes any submenus in the same format
   */

  //@track links = [];

  /*
   * hideOnScroll: Boolean
   */

  _hideOnScroll = false;

  @api get hideOnScroll() {
    return this._hideOnScroll;
  }

  set hideOnScroll(value) {
    this._hideOnScroll = value;
  }

  /*
   * menuContentOpen: Boolean
   */

  _menuContentOpen = false;
  @api get isMenuContentOpen() {
    return this._menuContentOpen;
  }

  set isMenuContentOpen(value) {
    this._menuContentOpen = value;
    this.toggleBodyScroll();
  }

  get isMenuContentClosed() {
    return !this.isMenuContentOpen;
  }

  @track menuLayout = "vertical";
  @track searchState = "closed";
  @track menuState = "closed";
  @track lastRootMenuClicked = -1;
  @track headerVisible = true;
  @track lastScrollTop = 0;
  @track stickyActive = false;
  @track offsetTop = 0;
  @track menuWideEnabled = null;

  windowsResizeFunc;
  scrollFunc;

  connectedCallback() {
    this.windowsResizeFunc = this.windowResize.bind(this);
    window.addEventListener("resize", this.windowsResizeFunc);
    this.windowResize();

    if (this.hideOnScroll) {
      this.scrollFunc = this.scroll.bind(this);
      window.addEventListener("scroll", this.scrollFunc);
    }
  }

  disconnectedCallback() {
    window.removeEventListener("resize", this.windowsResizeFunc);

    clearAllBodyScrollLocks();
    if (this.hideOnScroll) {
      window.removeEventListener("scroll", this.scrollFunc);
    }
  }

  get computedSiteHeaderClass() {
    return computeClass({
      "rpl-site-header": true,
      "rpl-site-header--open": this.isMenuContentOpen,
      "rpl-site-header--sticky": this.stickyActive
    });
  }

  get computedMenuButtonClass() {
    return computeClass({
      "rpl-site-header__btn": true,
      "rpl-site-header__btn--menu": true,
      "rpl-site-header__btn--menu-open": this.isMenuOpen
    });
  }

  get computedDividerVicClass() {
    return (
      "rpl-site-header__divider rpl-site-header__divider--vic " +
      this.dividerStateClass
    );
  }

  get computedLogoContainerClass() {
    return computeClass({
      "rpl-site-header__title": true,
      "rpl-site-header__logo-container--vic-logo-primary": true,
      "rpl-site-header__logo-container--vic-logo-primary--cobrand":
        this.cobrandImageSrc
    });
  }

  get computedDividerCobrandClass() {
    return (
      "rpl-site-header__divider rpl-site-header__divider--cobrand " +
      this.dividerStateClass
    );
  }

  get computedMenuContainerClass() {
    return computeClass({
      "rpl-site-header__menu-container": true,
      "rpl-site-header__menu-container--horizontal":
        this.menuLayout === "horizontal",
      "rpl-site-header__menu-container--vertical":
        this.menuLayout === "vertical"
    });
  }

  get computedLogoutButtonClass() {
    return computeClass({
      "rpl-site-header__btn": true,
      "rpl-site-header__btn--logout": true,
      "rpl-site-header__btn--logout-open": this.isMenuOpen
    });
  }

  get computedSearchButtonClass() {
    return computeClass({
      "rpl-site-header__btn": true,
      "rpl-site-header__btn--search": true,
      "rpl-site-header__btn--search-open": this.isSearchOpen
    });
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

  get dividerStateClass() {
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

  get showMenuButton() {
    const menuLinkCount =
      Array.isArray(this._navItems) && this._navItems.length > 0;

    if (
      this.menuState === "opened" &&
      this.searchState !== "opened" &&
      menuLinkCount
    ) {
      return true;
    }

    return this.menuLayout === "vertical" && this.searchState !== "opened";
  }

  toggleBodyScroll() {
    if (this.isMenuContentOpen) {
      let nextTickFunc = function () {
        let menuEl = this.querySelector(".rpl-site-header__menu-container");
        if (menuEl) {
          disableBodyScroll(menuEl);
        }
      };

      nextTick(nextTickFunc.bind(this));
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

  scroll() {
    let rootElement = this.querySelector("[data-sfgpsdsauvicsiteheader]");
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

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

  /*** NAV ***/
  /*
   * navItems
   * Array of navigation item objects, format { url: '', text: '', subNav: ... }
   */

  _originalNavItems;
  _navItems;

  @api get navItems() {
    return this._originalNavItems;
  }

  set navItems(items) {
    this._originalNavItems = items;
    this.navItemsMapping();
  }

  navItemsMapping() {
    let map = {};
    this._navItems = this._originalNavItems
      ? this.mapItems("navitem", 0, map, this._originalNavItems)
      : null;
    this._mapItems = map;
  }

  _mapItems;

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
}
