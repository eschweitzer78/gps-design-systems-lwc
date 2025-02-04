// Based on RplPrimaryNav v2.6.2

import { LightningElement, api, track } from "lwc";
import { normaliseBoolean, computeClass } from "c/sfGpsDsHelpers";
import { BreakpointsMixin } from "c/sfGpsDsAuVic2BreakpointsMixin";

const DEBUG = false;
const CLASS_NAME = "sfGpsDsVic2PrimaryNav";

const SHOWSEARCH_DEFAULT = true;
const SHOWSEARCH_FALLBACK = false;
const SHOWQUICKEXIT_DEFAULT = true;
const SHOWQUICKEXIT_FALLBACK = false;

export default class extends BreakpointsMixin(LightningElement) {
  @api primaryLogo;
  @api secondaryLogo;
  @api items;

  /* api: showSearch */

  _showSearch = SHOWSEARCH_DEFAULT;
  _showSearchOriginal = SHOWSEARCH_DEFAULT;

  @api
  get showSearch() {
    return this._showSearchOriginal;
  }

  set showSearch(value) {
    this._showSearchOriginal = value;
    this._showSearch = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: SHOWSEARCH_FALLBACK
    });
  }

  /* api: showQuickExit */

  _showQuickExit = SHOWQUICKEXIT_DEFAULT;
  _showQuickExitOriginal = SHOWQUICKEXIT_DEFAULT;

  @api
  get showQuickExit() {
    return this._showQuickExitOriginal;
  }

  set showQuickExit(value) {
    this._showQuickExitOriginal = value;
    this._showQuickExit = normaliseBoolean(value, {
      acceptString: true,
      fallbackValue: SHOWQUICKEXIT_FALLBACK
    });
  }

  /* tracked */

  @track _isHidden = false;
  @track _isFixed = false;
  @track _scrollPosition = 0;
  @track _activeNavItems = {
    level1: undefined,
    level2: undefined,
    level3: undefined
  };
  @track _hasUserActions;
  @track activeFocusTrap;

  /* track: _isSearchActive */

  @track __isSearchActive;

  get _isSearchActive() {
    return this.__isSearchActive;
  }

  set _isSearchActive(value) {
    this.__isSearchActive = value;
    this.watchIsExpanded();
  }

  /* getter/setters */

  __isMegaNavActive = false;

  get _isMegaNavActive() {
    return this.__isMegaNavActive;
  }

  set _isMegaNavActive(newValue) {
    this.__isMegaNavActive = newValue;

    this.watchIsMegaNavActive();
    this.watchIsExpanded();
  }

  /* getters */

  get computedIsLargeScreen() {
    return this.bpGreaterOrEqual("l");
  }

  get computedIsXLargeScreen() {
    return this.bpGreaterOrEqual("xl");
  }

  get computedIsExpanded() {
    return this._isMegaNavActive || this._isSearchActive;
  }

  get computedNavCollapse() {
    let collapsed = true;
    let breakpoint = "default";
    let count = this.items?.length || 0;

    if (this._showSearch) count++;
    if (this._hasUserActions) count++;
    if (this.secondaryLogo) count++;

    if (count <= 6) {
      breakpoint = "l";
      collapsed = !this.computedIsLargeScreen;
    } else if (count === 7) {
      breakpoint = "xl";
      collapsed = !this.computedIsXLargeScreen;
    } else if (count > 7) {
      breakpoint = "always";
    }

    return { breakpoint, collapsed };
  }

  get decoratedFocusTarget() {
    return {
      navCollapsed: this.computedNavCollapse.collapsed,
      hasQuickExit: this._showQuickExit,
      hasUserActions: this._hasUserActions,
      isMegaNavActive: this._isMegaNavActive
    };
  }

  get computedClassName() {
    return computeClass({
      "rpl-primary-nav": true,
      "rpl-primary-nav--hidden": this._isHidden,
      "rpl-primary-nav--fixed": this._isFixed,
      "rpl-primary-nav--expanded": this.computedIsExpanded,
      [`rpl-primary-nav--collapse-until-${this.computedNavCollapse.breakpoint}`]: true
    });
  }

  get computedStyle() {
    return `--local-expanded-height: ${this._clientHeight}px`;
  }

  get computedNavOffset() {
    return this._rendered
      ? this.refs.navContainer.getBoundingClientRect().top
      : 0;
  }

  /* methods */

  watchIsMegaNavActive() {
    const newValue = this._isMegaNavActive;

    // If mega nav closes, toggle off any currently active menu items
    if (!newValue) {
      this._activeNavItems = {
        level1: undefined,
        level2: undefined,
        level3: undefined
      };
    }
  }

  watchIsExpanded() {
    const newValue = this.computedIsExpanded;

    // If computedIsExpanded changes toggle viewport locked class
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
    if (this._activeNavItems["level" + level]?.id !== item?.id) {
      this._activeNavItems["level" + level] = item;
    }

    // Item needs to be made inactive
    else {
      this._activeNavItems["level" + level] = undefined;
    }

    if (level === 1) {
      const keepNavOpen = open || this.computedNavCollapse.collapsed;

      // Make search inactive
      this._isSearchActive = false;

      // If the target item is now active, make sure the mega nav is also active
      this._isMegaNavActive =
        keepNavOpen || this._activeNavItems.level1?.id === item.id;

      // Clear any active sub menus
      this._activeNavItems.level2 = undefined;
      this._activeNavItems.level3 = undefined;
    } else if (level === 2) {
      this._activeNavItems.level3 = undefined;
    }
  }

  toggleMobileMenu(text) {
    // Make search inactive
    this._isSearchActive = false;

    // Toggle mega nav
    this._isMegaNavActive = !this._isMegaNavActive;

    this.dispatchEvent(
      new CustomEvent("togglemenu", {
        detail: {
          text,
          action: this._isMegaNavActive ? "open" : "close"
        }
      })
    );
  }

  toggleSearch() {
    if (DEBUG)
      console.log(
        CLASS_NAME,
        "> toggleSearch",
        this._isMegaNavActive,
        this._isSearchActive,
        this
      );

    // Make mega nav inactive
    this._isMegaNavActive = false;

    // Toggle search
    this._isSearchActive = !this._isSearchActive;

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
        this._isMegaNavActive,
        this._isSearchActive
      );
  }

  /* event management */

  handleScroll() {
    const newPosition = window.scrollY;
    const scrollingDown = newPosition > this._scrollPosition;
    const beyondNav = this.computedNavOffset < 0;

    this._scrollPosition = newPosition;
    this._isHidden = scrollingDown && beyondNav;
    this._isFixed = !scrollingDown && beyondNav;
  }

  handleEscapeKey(event) {
    if (event.key === "Escape" && this.computedIsExpanded) {
      this._isMegaNavActive = false;
      this._isSearchActive = false;
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
    this._hasUserActions = true;
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
    this._isMegaNavActive = false;
  }

  handleFocusTrap() {
    this.refs.navbar.focus();
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

  _rendered = false;

  renderedCallback() {
    if (!this._rendered) {
      this._rendered = true;
    }
  }
}
