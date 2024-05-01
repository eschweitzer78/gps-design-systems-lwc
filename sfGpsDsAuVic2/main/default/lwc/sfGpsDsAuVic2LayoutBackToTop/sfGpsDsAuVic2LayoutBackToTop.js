import { LightningElement, api, track } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

const SCROLL_THRESHOLD = 1080;

export default class SfGpsDsAuVic2LayoutBackToTop extends LightningElement {
  @api topElementId;
  @api className;
  @track scrollY;

  get isShown() {
    return this.scrollY > SCROLL_THRESHOLD;
  }

  get isSticky() {
    if (!this._isRendered) {
      return false;
    }

    const bottomPos = this.refs.containerRef.offsetTop - window.innerHeight;
    return this.scrollY.value < bottomPos;
  }

  get computedClassName() {
    return computeClass({
      "rpl-back-to-top": true,
      "rpl-back-to-top--visible": this.isShown,
      "rpl-back-to-top--sticky": this.isSticky,
      "rpl-u-screen-only": true,
      [this.className]: this.className
    });
  }

  /* lifecycle */

  _handleScroll;

  connectedCallback() {
    this._handleScroll = this.handleScroll.bind(this);
    window.addEventListener("scroll", this._listenForScroll);
  }

  disconnectedCallback() {
    window.removeEventListener("scroll", this._handleScroll);
  }

  renderedCallback() {
    if (!this._isRendered) this._isRendered = true;
  }

  /* event management */

  handleScroll() {
    const rootElement = this.template.firstElementChild;

    if (rootElement) {
      this.scrollY = window.scrollY || window.pageYOffset;
    }
  }
}
