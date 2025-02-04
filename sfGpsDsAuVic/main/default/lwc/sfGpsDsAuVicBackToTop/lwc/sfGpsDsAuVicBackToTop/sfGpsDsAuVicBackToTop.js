import { LightningElement, api, track } from "lwc";

export default class extends LightningElement {
  @api skipLinkId = "rpl-skip-link";
  @api label = "Back to top";
  @api className;

  @track show = false;
  @track sticky = true;
  @track expected = false;
  stickyPos = 1200;

  setScrollVisibility() {
    const rootElement = this.template.firstElementChild;

    if (rootElement) {
      let scrollY = window.scrollY || window.pageYOffset;

      if (
        scrollY >
        rootElement.offsetTop + rootElement.offsetHeight - window.innerHeight
      ) {
        if (this.sticky) {
          this.sticky = false;
        }
      } else if (!this.sticky) {
        this.sticky = true;
      }

      // Show/Hide button
      if (scrollY > this.stickyPos) {
        if (!this.show) {
          this.show = true;
        }
      } else if (this.show) {
        this.show = false;
      }
    }
  }

  resize() {
    // Don't render component if scroll is not expected to exceed threshold.
    this.expected =
      document.body.offsetHeight - window.innerHeight > this.stickyPos;
    this.setScrollVisibility();
  }

  /* lifecycle */

  _listenForScroll;
  _listenForResize;

  connectedCallback() {
    this._listenForScroll = this.setScrollVisibility.bind(this);
    window.addEventListener("scroll", this._listenForScroll);

    this._listenForResize = this.resize.bind(this);
    window.addEventListener("resize", this._listenForResize);
  }

  _rendered;

  renderedCallback() {
    if (!this._rendered) {
      this.resize();

      this._rendered = true;
    }
  }

  disconnectedCallback() {
    window.removeEventListener("scroll", this._listenForScroll);
    window.removeEventListener("resize", this._listenForResize);
    this._listenForScroll = null;
    this._listenForResize = null;
  }
}
