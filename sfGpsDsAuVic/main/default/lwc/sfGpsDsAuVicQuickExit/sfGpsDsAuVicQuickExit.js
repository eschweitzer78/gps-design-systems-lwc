import { LightningElement, api, track } from "lwc";

import { computeClass } from "c/sfGpsDsHelpers";

const quickExitUrl = "https://www.google.com";

export default class SfGpsDsAuVicQuickExit extends LightningElement {
  @api text = "Quick exit";
  @api isSticky;

  @track _escapeUrl = quickExitUrl;
  @track _menuStickyActive = false;
  @track _stickyActive = false;
  @track _headerVisible = true;
  @track _offsetTop = 0;
  @track _lastPageScrollTop = 0;
  @track _menuOffsetElement;

  get computedClass() {
    return computeClass({
      "rpl-quick-exit": true,
      "rpl-quick-exit--sticky": this._stickyActive
    });
  }

  get computedAnchorClass() {
    return computeClass({
      "rpl-quick-exit__button": true,
      "rpl-quick-exit__button--stickable": this.isSticky,
      "rpl-quick-exit__button--sticky": this._stickyActive,
      "rpl-quick-exit__button--header-visible":
        this._stickyActive && this._headerVisible
    });
  }

  handleClick() {
    const newTab = window.open(this._escapeURL, "_blank");
    if (newTab) {
      newTab.focus();
    }
  }

  scroll() {
    const pageScrollTop =
      window.pageYOffset || document.documentElement.scrollTop;
    const isScrollingUp = pageScrollTop <= this._lastPageScrollTop;
    const elStyle = getComputedStyle(
      this.template.querySelector(".rpl-quick-exit__button")
    );
    const elTop = parseInt(elStyle.top) || 0;
    const elMargin = isScrollingUp ? parseInt(elStyle.marginTop) : 0;
    const elStickPoint =
      this.template.querySelector(".rpl-quick-exit").offsetTop -
      elMargin -
      elTop;
    const menuStickPoint = this._menuOffsetElement
      ? this._menuOffsetElement.offsetTop
      : 0;
    const menuStickyActive = pageScrollTop > menuStickPoint;

    this._stickyActive =
      pageScrollTop > elStickPoint || (isScrollingUp && menuStickyActive);
    this._headerVisible = isScrollingUp || !this._stickyActive;
    this._lastPageScrollTop = pageScrollTop <= 0 ? 0 : pageScrollTop;
  }

  _listenForScroll;

  connectedCallback() {
    if (this.isSticky) {
      this._menuOffsetElement = this.template.querySelector(
        this.menuOffsetSelector
      );

      this._listenForScoll = this.scroll.bind(this);
      window.addEventListener("scroll", this._listenForScoll);
    }
  }

  disconnectedCallback() {
    if (this.isSticky) {
      window.removeEventListener("scroll", this._listenForScoll);
    }
  }
}
