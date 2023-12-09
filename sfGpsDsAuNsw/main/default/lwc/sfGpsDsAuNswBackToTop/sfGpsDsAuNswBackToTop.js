import { api, track, LightningElement } from "lwc";
import { debounce } from "c/sfGpsDsHelpers";

export default class SfGpsDsAuNswBackToTop extends LightningElement {
  @api scrollOffset = 0;
  @api className;
  @track show;

  _width;
  _height;
  _scrollPosition;

  get isMobile() {
    return this._width < 768;
  }

  checkBackToTop() {
    const windowTop = window.scrollY || document.documentElement.scrollTop;
    const scroll = this._scrollPosition;

    this._scrollPosition = window.scrollY;

    if (this.scrollOffset && this.scrollOffset > 0) {
      this.show = windowTop >= this.scrollOffset;
    } else {
      this.show = scroll > this._scrollPosition && this._scrollPosition > 200;
    }
    console.log("show", this.show);
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
