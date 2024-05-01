// Based on RplPrimaryNav v2.6.2

import { LightningElement, api, track } from "lwc";
import { normaliseBoolean, computeClass } from "c/sfGpsDsHelpers";
import { BreakpointsMixin } from "c/sfGpsDsAuVic2BreakpointsMixin";

const DEBUG = false;
const CLASS_NAME = "sfGpsDsVic2PrimaryNav";

export default class extends BreakpointsMixin(LightningElement) {
  @api primaryLogo;
  @api secondaryLogo;
  @api items;

  /* api: showSearch */

  _showSearchOriginal = true;
  _showSearch = true;

  @api get showSearch() {
    return this._showSearchOriginal;
  }

  set showSearch(value) {
    this._showSearchOriginal = value;
    this._showSearch = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: false
    });
  }

  /* api: showQuickExit */

  _showQuickExitOriginal = true;
  _showQuickExit = true;

  @api get showQuickExit() {
    return this._showQuickExitOriginal;
  }

  set showQuickExit(value) {
    this._showQuickExitOriginal = value;
    this._showQuickExit = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: false
    });
  }

  @track isHidden = false;
  @track isFixed = false;
  @track scrollPosition = 0;
  @track activeNavItems = {
    level1: undefined,
    level2: undefined,
    level3: undefined
  };
  @track hasUserActions;
  @track _isSearchActive;

  get isSearchActive() {
    return this._isSearchActive;
  }

  set isSearchActive(value) {
    this._isSearchActive = value;
    this.watchIsExpanded();
  }

  /* getter/setters */

  _isMegaNavActive = false;

  get isMegaNavActive() {
    return this._isMegaNavActive;
  }

  set isMegaNavActive(newValue) {
    this._isMegaNavActive = newValue;

    this.watchIsMegaNavActive();
    this.watchIsExpanded();
  }

  /* getters */

  get isLargeScreen() {
    return this.bpGreaterOrEqual("l");
  }

  get isXLargeScreen() {
    return this.bpGreaterOrEqual("xl");
  }

  get isExpanded() {
    return this.isMegaNavActive || this.isSearchActive;
  }

  get navCollapse() {
    let collapsed = true;
    let breakpoint = "default";
    let count = this.items?.length || 0;

    if (this.showSearch) count++;
    if (this.hasUserActions) count++;
    if (this.secondaryLogo) count++;

    if (count <= 6) {
      breakpoint = "l";
      collapsed = !this.isLargeScreen;
    } else if (count === 7) {
      breakpoint = "xl";
      collapsed = !this.isXLargeScreen;
    } else if (count > 7) {
      breakpoint = "always";
    }

    return { breakpoint, collapsed };
  }

  get decoratedFocusTarget() {
    return {
      navCollapsed: this.navCollapse.collapsed,
      hasQuickExit: this.showQuickExit,
      hasUserActions: this.hasUserActions,
      isMegaNavActive: this._isMegaNavActive
    };
  }

  get computedClassName() {
    return computeClass({
      "rpl-primary-nav": true,
      "rpl-primary-nav--hidden": this.isHidden,
      "rpl-primary-nav--fixed": this.isFixed,
      "rpl-primary-nav--expanded": this.isExpanded,
      [`rpl-primary-nav--collapse-until-${this.navCollapse.breakpoint}`]: true
    });
  }

  get computedStyle() {
    return `--local-expanded-height: ${this._clientHeight}px`;
  }

  /* methods */

  watchIsMegaNavActive() {
    const newValue = this.isMegaNavActive;

    // If mega nav closes, toggle off any currently active menu items
    if (!newValue) {
      this.activeNavItems = {
        level1: undefined,
        level2: undefined,
        level3: undefined
      };
    }
  }

  @track activeFocusTrap;

  watchIsExpanded() {
    const newValue = this.isExpanded;

    // If isExpanded changes toggle viewport locked class
    // and focus trap
    if (newValue) {
      document.body.classList.add("rpl-u-viewport-locked");
      this.activeFocusTrap = true;

      if (DEBUG) console.log(CLASS_NAME, "watchIsExpanded: activateFocusTrap");
    } else {
      document.body.classList.remove("rpl-u-viewport-locked");
      this.activeFocusTrap = false;

      if (DEBUG)
        console.log(CLASS_NAME, "watchIsExpanded: deactivateFocusTrap");
    }
  }

  toggleNavItem(level, item, open) {
    // Item needs to be made active
    if (this.activeNavItems["level" + level]?.id !== item?.id) {
      this.activeNavItems["level" + level] = item;
    }

    // Item needs to be made inactive
    else {
      this.activeNavItems["level" + level] = undefined;
    }

    if (level === 1) {
      const keepNavOpen = open || this.navCollapse.collapsed;

      // Make search inactive
      this.isSearchActive = false;

      // If the target item is now active, make sure the mega nav is also active
      this.isMegaNavActive =
        keepNavOpen || this.activeNavItems.level1?.id === item.id;

      // Clear any active sub menus
      this.activeNavItems.level2 = undefined;
      this.activeNavItems.level3 = undefined;
    } else if (level === 2) {
      this.activeNavItems.level3 = undefined;
    }
  }

  toggleMobileMenu(text) {
    // Make search inactive
    this.isSearchActive = false;

    // Toggle mega nav
    this.isMegaNavActive = !this.isMegaNavActive;

    this.dispatchEvent(
      new CustomEvent("togglemenu", {
        detail: {
          text,
          action: this.isMegaNavActive ? "open" : "close"
        }
      })
    );
  }

  toggleSearch() {
    if (DEBUG)
      console.log(
        CLASS_NAME,
        "> toggleSearch",
        this.isMegaNavActive,
        this.isSearchActive,
        this
      );

    // Make mega nav inactive
    this.isMegaNavActive = false;

    // Toggle search
    this.isSearchActive = !this.isSearchActive;

    this.dispatchEvent(
      new CustomEvent("togglesearch", {
        detail: {
          action: this.isSearchValue ? "open" : "close"
        }
      })
    );

    if (DEBUG)
      console.log(
        CLASS_NAME,
        "< toggleSearch",
        this.isMegaNavActive,
        this.isSearchActive
      );
  }

  /* lifecycle */

  _handleScrollFunc;

  connectedCallback() {
    super.connectedCallback();

    this.handleScroll();
    this._handleScrollFunc = this.handleScroll.bind(this);
    window.addEventListener("scroll", this._handleScrollFunc);
  }

  disconnectedCallback() {
    window.removeEventListener("scroll", this._handleScrollFunc);
    document.body.classList.remove("rpl-u-viewport-locked");

    super.disconnectedCallback();
  }

  /* event management */

  handleScroll() {
    const newPosition = window.scrollY;
    const scrollingDown = newPosition > this.scrollPosition;
    const beyondNav = this.navOffest < 0;

    this.scrollPosition = newPosition;
    this.isHidden = scrollingDown && beyondNav;
    this.isFixed = !scrollingDown && beyondNav;
  }

  handleEscapeKey(event) {
    if (event.key === "Escape" && this.isExpanded) {
      this.isMegaNavActive = false;
      this.isSearchActive = false;
    }
  }

  handleToggleItem(event) {
    this.toggleNavItem(event.detail.level, event.detail.item);
  }

  handleToggleMobileMenu(event) {
    this.toggleMobileMenu(event.detail);
  }

  handleToggleSearch() {
    this.toggleSearch();
  }

  handleUserActionSlotChange() {
    // TODO refine
    this.hasUserActions = true;
  }

  handlePrimaryNavFocus(event) {
    event.stopPropagation();

    if (DEBUG) console.log(CLASS_NAME, "handlePrimaryNavFocus", event.detail);

    const dfks = this.template.querySelectorAll("[data-focus-key]");

    for (let i = 0; i < dfks.length; i++) {
      dfks[i].notifyFocus(event.detail);
    }
  }

  handleNavigate() {
    // parent will take care of actual navigation
    this.isMegaNavActive = false;
  }

  handleFocusTrap() {
    console.log("handleFocusTrap");
    this.refs.navbar.focus();
  }
}
