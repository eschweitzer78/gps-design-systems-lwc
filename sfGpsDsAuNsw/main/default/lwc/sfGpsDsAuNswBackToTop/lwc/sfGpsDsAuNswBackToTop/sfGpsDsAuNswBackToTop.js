import { api, LightningElement } from "lwc";
import { debounce } from "c/sfGpsDsHelpers";

const MOBILE_BREAKPOINT = 768;

export default class extends LightningElement {
  @api scrollOffset = 0;
  @api className;

  _show;
  _width;
  _height;
  _scrollPosition;

  /* getters */

  get _isMobile() {
    return this._width < MOBILE_BREAKPOINT;
  }

  /* methods */

  checkBackToTop() {
    const windowTop = window.scrollY || document.documentElement.scrollTop;
    const scroll = this._scrollPosition;

    this._scrollPosition = window.scrollY;

    if (this.scrollOffset && this.scrollOffset > 0) {
      this.show = windowTop >= this.scrollOffset;
    } else {
      this.show = scroll > this._scrollPosition && this._scrollPosition > 200;
    }
  }

  resize() {
    this._width = Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0
    );
    this._height = Math.max(
      document.documentElement.clientHeight || 0,
      window.innerHeight || 0
    );
  }

  /* lifecycle */

  _listenForScroll;
  _listenForResize;

  connectedCallback() {
    this._listenForScroll = debounce(this.checkBackToTop.bind(this), 250);
    window.addEventListener("scroll", this._listenForScroll);

    this._listenForResize = debounce(this.resize.bind(this), 250);
    window.addEventListener("resize", this._listenForResize);
  }

  disconnectedCallback() {
    if (this._listenForScroll) {
      window.removeEventListener("scroll", this._listenForScroll);
    }

    if (this._listenForResize) {
      window.removeEventListener("resize", this._listenForResize);
    }
  }

  _rendered;

  renderedCallback() {
    if (!this._rendered) {
      this._rendered = true;
      this.checkBackToTop();
      this.resize();
    }
  }
}
