import { LightningElement, api, track } from "lwc";
import { computeClass } from "c/sfGpsDsHelpers";

const SCROLL_THRESHOLD = 1080;

export default class extends LightningElement {
  @api label = "Back to top";
  @api topElementId = "rpl-skip-links";
  @api className;
  @track scrollY;

  get isShown() {
    return this.scrollY > SCROLL_THRESHOLD;
  }

  get isSticky() {
    if (!this._containerEl) {
      return false;
    }

    const rect = this._containerEl.getBoundingClientRect();
    return rect.top > window.innerHeight;
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

  get computedUrl() {
    return `#${this.topElementId}`;
  }

  /* event management */

  handleScroll() {
    if (this._containerEl) {
      this.scrollY = window.scrollY || window.pageYOffset;
    }
  }

  /* lifecycle */

  _handleScroll;
  _containerEl;

  connectedCallback() {
    this._handleScroll = this.handleScroll.bind(this);
    window.addEventListener("scroll", this._handleScroll);
  }

  disconnectedCallback() {
    window.removeEventListener("scroll", this._handleScroll);
  }

  renderedCallback() {
    if (!this._isRendered) {
      this._isRendered = true;
      this._containerEl = this.refs.containerRef;
    }
  }
}
